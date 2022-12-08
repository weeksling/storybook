import express from 'express';
import compression from 'compression';

import type { CoreConfig, Options, StorybookConfig } from '@storybook/types';

import { logConfig } from '@storybook/core-common';

import { getMiddleware } from './utils/middleware';
import { getServerAddresses } from './utils/server-address';
import { getServer } from './utils/server-init';
import { useStatics } from './utils/server-statics';
import { getServerChannel } from './utils/get-server-channel';

import { openInBrowser } from './utils/open-in-browser';
import { getManagerBuilder, getPreviewBuilder } from './utils/get-builders';
import type { StoryIndexGenerator } from './utils/StoryIndexGenerator';
import { getStoryIndexGenerator } from './utils/getStoryIndexGenerator';
import { doTelemetry } from './utils/doTelemetry';
import { router } from './utils/router';
import { getAccessControlMiddleware } from './utils/getAccessControlMiddleware';

export async function storybookDevServer(options: Options) {
  const app = express();

  const [server, features, core] = await Promise.all([
    getServer(app, options),
    options.presets.apply<StorybookConfig['features']>('features'),
    options.presets.apply<CoreConfig>('core'),
  ]);

  const serverChannel = getServerChannel(server);

  // try get index generator, if failed, send telemetry without storyCount, then rethrow the error
  const initializedStoryIndexGenerator: Promise<StoryIndexGenerator> = getStoryIndexGenerator(
    features,
    options,
    serverChannel
  );

  doTelemetry(core, initializedStoryIndexGenerator, options);

  app.use(compression({ level: 1 }));

  if (typeof options.extendServer === 'function') {
    options.extendServer(server);
  }

  app.use(getAccessControlMiddleware(core?.crossOriginIsolated));

  // User's own static files
  const usingStatics = useStatics(router, options);

  getMiddleware(options.configDir)(router);

  app.use(router);

  const { port, host } = options;
  const proto = options.https ? 'https' : 'http';
  const { address, networkAddress } = getServerAddresses(port, host, proto);

  const listening = new Promise<void>((resolve, reject) => {
    // @ts-expect-error (Following line doesn't match TypeScript signature at all 🤔)
    server.listen({ port, host }, (error: Error) => (error ? reject(error) : resolve()));
  });

  const builderName = typeof core?.builder === 'string' ? core.builder : core?.builder?.name;

  const [previewBuilder, managerBuilder] = await Promise.all([
    getPreviewBuilder(builderName, options.configDir),
    getManagerBuilder(),
  ]);

  if (options.debugWebpack) {
    logConfig('Preview webpack config', await previewBuilder.getConfig(options));
  }

  const managerResult = await managerBuilder.start({
    startTime: process.hrtime(),
    options,
    router,
    server,
    channel: serverChannel,
  });

  let previewStarted: Promise<any> = Promise.resolve();

  if (!options.ignorePreview) {
    previewStarted = previewBuilder
      .start({
        startTime: process.hrtime(),
        options,
        router,
        server,
        channel: serverChannel,
      })
      .catch(async (e: any) => {
        await managerBuilder?.bail().catch();
        // For some reason, even when Webpack fails e.g. wrong main.js config,
        // the preview may continue to print to stdout, which can affect output
        // when we catch this error and process those errors (e.g. telemetry)
        // gets overwritten by preview progress output. Therefore, we should bail the preview too.
        await previewBuilder?.bail().catch();

        // re-throw the error
        throw e;
      });
  }

  // this is a preview route, the builder has to be started before we can serve it
  // this handler keeps request to that route pending until the builder is ready to serve it, preventing a 404
  router.get('/iframe.html', (req, res, next) => {
    previewStarted.then(() => next());
  });

  Promise.all([initializedStoryIndexGenerator, listening, usingStatics]).then(async () => {
    if (!options.ci && !options.smokeTest && options.open) {
      openInBrowser(host ? networkAddress : address);
    }
  });

  return { previewResult: await previewStarted, managerResult, address, networkAddress };
}

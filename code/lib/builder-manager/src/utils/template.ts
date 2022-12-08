import path, { dirname, join } from 'path';
import fs from 'fs-extra';

import { render } from 'ejs';

import type { DocsOptions, Options, Ref } from '@storybook/types';

const interpolate = (string: string, data: Record<string, string> = {}) =>
  Object.entries(data).reduce((acc, [k, v]) => acc.replace(new RegExp(`%${k}%`, 'g'), v), string);

export const getTemplatePath = async (template: string) => {
  return join(
    dirname(require.resolve('@storybook/builder-manager/package.json')),
    'templates',
    template
  );
};

export const readTemplate = async (template: string) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const path = await getTemplatePath(template);

  return fs.readFile(path, 'utf8');
};

export async function getManagerHeadTemplate(
  configDirPath: string,
  interpolations: Record<string, string>
) {
  const head = await fs
    .pathExists(path.resolve(configDirPath, 'manager-head.html'))
    .then<Promise<string> | false>((exists) => {
      if (exists) {
        return fs.readFile(path.resolve(configDirPath, 'manager-head.html'), 'utf8');
      }
      return false;
    });

  if (!head) {
    return '';
  }

  return interpolate(head, interpolations);
}

export async function getManagerMainTemplate() {
  return getTemplatePath(`manager.ejs`);
}

export const renderHTML = async (
  template: Promise<string>,
  title: Promise<string | false>,
  customHead: Promise<string | false>,
  cssFiles: string[],
  jsFiles: string[],
  features: Promise<Record<string, any>>,
  refs: Promise<Record<string, Ref>>,
  logLevel: Promise<string>,
  docsOptions: Promise<DocsOptions>,
  { versionCheck, releaseNotesData, previewUrl, serverChannelUrl, configType }: Options
) => {
  const customHeadRef = await customHead;
  const titleRef = await title;
  const templateRef = await template;

  return render(templateRef, {
    title: titleRef ? `${titleRef} - Storybook` : 'Storybook',
    files: { js: jsFiles, css: cssFiles },
    globals: {
      FEATURES: JSON.stringify(await features, null, 2),
      REFS: JSON.stringify(await refs, null, 2),
      LOGLEVEL: JSON.stringify(await logLevel, null, 2),
      DOCS_OPTIONS: JSON.stringify(await docsOptions, null, 2),
      CONFIG_TYPE: JSON.stringify(await configType, null, 2),
      // These two need to be double stringified because the UI expects a string
      VERSIONCHECK: JSON.stringify(JSON.stringify(versionCheck), null, 2),
      RELEASE_NOTES_DATA: JSON.stringify(JSON.stringify(releaseNotesData), null, 2),
      PREVIEW_URL: JSON.stringify(previewUrl, null, 2), // global preview URL
      SERVER_CHANNEL_URL: JSON.stringify(serverChannelUrl, null, 2),
    },
    head: customHeadRef ? await fs.readFile(customHeadRef, 'utf8') : '',
  });
};

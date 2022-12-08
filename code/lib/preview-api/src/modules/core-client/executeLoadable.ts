/// <reference types="node" />
/// <reference types="webpack-env" />

import { logger } from '@storybook/client-logger';
import type { Path, ModuleExports } from '@storybook/types';

export interface RequireContext {
  keys: () => string[];
  (id: string): any;
  resolve(id: string): string;
}

export type LoaderFunction = () => void | any[];

export type Loadable = RequireContext | RequireContext[] | LoaderFunction;

/**
 * Executes a Loadable (function that returns exports or require context(s))
 * and returns a map of filename => module exports
 *
 * @param loadable Loadable
 * @returns Map<Path, ModuleExports>
 */
export function executeLoadable(loadable: Loadable) {
  let reqs = null;
  // todo discuss / improve type check
  if (Array.isArray(loadable)) {
    reqs = loadable;
  } else if ((loadable as RequireContext).keys) {
    reqs = [loadable as RequireContext];
  }

  let exportsMap = new Map<Path, ModuleExports>();
  if (reqs) {
    reqs.forEach((req) => {
      req.keys().forEach((filename: string) => {
        try {
          const fileExports = req(filename) as ModuleExports;
          exportsMap.set(
            typeof req.resolve === 'function' ? req.resolve(filename) : filename,
            fileExports
          );
        } catch (error: any) {
          const errorString =
            error.message && error.stack ? `${error.message}\n ${error.stack}` : error.toString();
          logger.error(`Unexpected error while loading ${filename}: ${errorString}`);
        }
      });
    });
  } else {
    const exported = (loadable as LoaderFunction)();
    if (Array.isArray(exported) && exported.every((obj) => obj.default != null)) {
      exportsMap = new Map(
        exported.map((fileExports, index) => [`exports-map-${index}`, fileExports])
      );
    } else if (exported) {
      logger.warn(
        `Loader function passed to 'configure' should return void or an array of module exports that all contain a 'default' export. Received: ${JSON.stringify(
          exported
        )}`
      );
    }
  }

  return exportsMap;
}

/**
 * Executes a Loadable (function that returns exports or require context(s))
 * and compares it's output to the last time it was run (as stored on a node module)
 *
 * @param loadable Loadable
 * @param m NodeModule
 * @returns { added: Map<Path, ModuleExports>, removed: Map<Path, ModuleExports> }
 */
export function executeLoadableForChanges(loadable: Loadable, m?: NodeModule) {
  let lastExportsMap: ReturnType<typeof executeLoadable> =
    m?.hot?.data?.lastExportsMap || new Map();
  if (m?.hot?.dispose) {
    m.hot.accept();
    m.hot.dispose((data) => {
      // eslint-disable-next-line no-param-reassign
      data.lastExportsMap = lastExportsMap;
    });
  }

  const exportsMap = executeLoadable(loadable);
  const added = new Map<Path, ModuleExports>();
  Array.from(exportsMap.entries())
    // Ignore files that do not have a default export
    .filter(([, fileExports]) => !!fileExports.default)
    // Ignore exports that are equal (by reference) to last time, this means the file hasn't changed
    .filter(([fileName, fileExports]) => lastExportsMap.get(fileName) !== fileExports)
    .forEach(([fileName, fileExports]) => added.set(fileName, fileExports));

  const removed = new Map<Path, ModuleExports>();
  Array.from(lastExportsMap.keys())
    .filter((fileName) => !exportsMap.has(fileName))
    .forEach((fileName) => {
      const value = lastExportsMap.get(fileName);
      if (value) {
        removed.set(fileName, value);
      }
    });

  // Save the value for the dispose() call above
  lastExportsMap = exportsMap;

  return { added, removed };
}

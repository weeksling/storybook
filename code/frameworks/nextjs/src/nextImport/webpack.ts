import type { Configuration as WebpackConfig } from 'webpack';
import semver from 'semver';
import { IgnorePlugin } from 'webpack';
import { getNextjsVersion } from '../utils';

export function configureNextImport(baseConfig: WebpackConfig) {
  const nextJSVersion = getNextjsVersion();

  const isNext12 = semver.satisfies(nextJSVersion, '~12');
  const isNext13 = semver.satisfies(nextJSVersion, '~13');
  const isNextVersionSmallerThan13 = semver.lt(nextJSVersion, '13.0.0');

  baseConfig.plugins = baseConfig.plugins ?? [];

  if (!isNext13) {
    baseConfig.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /next\/legacy\/image$/,
      })
    );
  }

  if (!isNext12) {
    baseConfig.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /next\/future\/image$/,
      })
    );
  }

  if (isNextVersionSmallerThan13) {
    baseConfig.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /next\/dist\/shared\/lib\/hooks-client-context$/,
      })
    );
  }

  if (semver.lt(nextJSVersion, '12.2.0')) {
    baseConfig.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /next\/dist\/shared\/lib\/app-router-context$/,
      })
    );
  }
}

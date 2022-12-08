import semver from 'semver';
import type { Configuration as WebpackConfig, RuleSetRule } from 'webpack';
import { addScopedAlias, getNextjsVersion } from '../utils';

export const configureImages = (baseConfig: WebpackConfig): void => {
  configureStaticImageImport(baseConfig);
  addScopedAlias(baseConfig, 'next/image');
};

const configureStaticImageImport = (baseConfig: WebpackConfig): void => {
  const version = getNextjsVersion();
  if (semver.lt(version, '11.0.0')) return;

  const rules = baseConfig.module?.rules;

  const assetRule = rules?.find(
    (rule) => typeof rule !== 'string' && rule.test instanceof RegExp && rule.test.test('test.jpg')
  ) as RuleSetRule;

  if (!assetRule) {
    return;
  }

  assetRule.test = /\.(apng|eot|otf|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/;

  rules?.push({
    test: /\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i,
    issuer: { not: /\.(css|scss|sass)$/ },
    use: [
      {
        loader: require.resolve('@storybook/nextjs/next-image-loader-stub.js'),
        options: {
          filename: assetRule.generator?.filename,
        },
      },
    ],
  });
  rules?.push({
    test: /\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$/i,
    issuer: /\.(css|scss|sass)$/,
    type: 'asset/resource',
    generator: {
      filename: assetRule.generator?.filename,
    },
  });
};

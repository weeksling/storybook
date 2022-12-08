// @ts-expect-error (loader-utils has no webpack5 compatible types)
import { interpolateName } from 'loader-utils';
import imageSizeOf from 'image-size';
import type { RawLoaderDefinition } from 'webpack';

interface LoaderOptions {
  filename: string;
}

const nextImageLoaderStub: RawLoaderDefinition<LoaderOptions> = function (content) {
  const { filename } = this.getOptions();
  const outputPath = interpolateName(this, filename.replace('[ext]', '.[ext]'), {
    context: this.rootContext,
    content,
  });

  this.emitFile(outputPath, content);

  const { width, height } = imageSizeOf(this.resourcePath);

  return `export default ${JSON.stringify({
    src: outputPath,
    height,
    width,
    blurDataURL: outputPath,
  })};`;
};

nextImageLoaderStub.raw = true;

export default nextImageLoaderStub;

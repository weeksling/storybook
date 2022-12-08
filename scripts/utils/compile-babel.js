/* eslint-disable no-console */
const fs = require('fs-extra');
const path = require('path');
const { join } = require('path');

function getCommand(watch, dir) {
  // Compile angular with tsc
  if (process.cwd().includes(path.join('frameworks', 'angular'))) {
    return '';
  }
  if (process.cwd().includes(path.join('addons', 'storyshots'))) {
    return '';
  }

  const args = [
    join(process.cwd(), 'src'),
    `--out-dir=${dir}`,
    `--config-file=${join(__dirname, '..', '.babelrc.js')}`,
  ];

  // babel copying over files it did not parse is a anti-pattern
  // but in the case of the CLI, it houses generators are are templates
  // moving all these is a lot of work. We should make different choices when we eventually refactor / rebuild the CLI
  if (process.cwd().includes(path.join('lib', 'cli'))) {
    args.push('--copy-files');
  }

  /*
   * angular needs to be compiled with tsc; a compilation with babel is possible but throws
   * runtime errors because of the the babel decorators plugin
   * Only transpile .js and let tsc do the job for .ts files
   */
  if (process.cwd().includes(path.join('addons', 'storyshots'))) {
    args.push(`--extensions=".js"`);
  } else {
    args.push(`--extensions=.js,.jsx,.ts,.tsx`);
  }

  if (watch) {
    args.push('-w');
  }

  return `yarn run -T babel ${args.join(' ')}`;
}

function handleExit(code, stderr, errorCallback) {
  if (code !== 0) {
    if (errorCallback && typeof errorCallback === 'function') {
      errorCallback(stderr);
    }

    process.exit(code);
  }
}

async function run({ watch, dir, silent, errorCallback }) {
  const execa = await import('execa');

  return new Promise((resolve, reject) => {
    const command = getCommand(watch, dir);

    if (command !== '') {
      const child = execa.execaCommand(command, {
        cwd: join(__dirname, '..'),
        buffer: false,
        env: { BABEL_MODE: path.basename(dir) },
      });

      let stderr = '';

      if (watch) {
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
      } else {
        child.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        child.stdout.on('data', (data) => {
          stderr += data.toString();
        });
      }

      child.on('exit', (code) => {
        resolve();
        handleExit(code, stderr, errorCallback);
      });
    } else {
      resolve();
    }
  });
}

async function babelify(options = {}) {
  const { watch = false, silent = true, errorCallback } = options;

  if (!(await fs.pathExists('src'))) {
    if (!silent) {
      console.log('No src dir');
    }
    return;
  }

  const runners = [
    run({ watch, dir: join(process.cwd(), 'dist/cjs'), silent, errorCallback }),
    run({ watch, dir: join(process.cwd(), 'dist/esm'), silent, errorCallback }),
  ];

  await Promise.all(runners);
}

module.exports = {
  babelify,
};

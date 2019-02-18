const MemoryFS = require('memory-fs');
const path = require('path');
const realFs = require('fs');
const pfs = require('bluebird').promisifyAll(require('fs'));
const webpack = require('webpack');
const { NormalModuleReplacementPlugin } = webpack;

const buildPage = (projectDir) => async (page) => {
  const fs = new MemoryFS();
  const memStat = fs.stat.bind(fs);
  fs.stat = function(path, ...args) {
    if (path === '/entry.js') {
      return memStat(path, ...args);
    }
    return realFs.stat(path, ...args);
  };
  const memReadFile = fs.readFile.bind(fs);
  fs.readFile = function(path, ...args) {
    if (path === '/entry.js') {
      return memReadFile(path, ...args);
    }
    return realFs.readFile(path, ...args);
  };
  let writtenPath = null;
  const memWriteFile = fs.writeFile.bind(fs);
  fs.writeFile = function(path, ...args) {
    writtenPath = path;
    return memWriteFile(path, ...args);
  };

  fs.writeFileSync('/entry.js', page);

  const webpackConfig = {
    mode: 'production',
    target: 'webworker',
    plugins: [
      new NormalModuleReplacementPlugin(
        /^path$/,
        path.resolve(__dirname, '../lib/polyfill-path.js'),
      ),
    ],
    node: {
      console: false,
      global: true,
      process: true,
      __filename: 'mock',
      __dirname: 'mock',
      Buffer: true,
      setImmediate: true,
      dns: false,
      fs: 'empty',
      path: false,
      crypto: 'empty',
      url: true,
      zlib: false,
    },
    entry: '/entry.js',
    output: { filename: 'output.js' },
    resolve: { modules: [] },
  };

  webpackConfig.resolve.modules = Array.from(
    new Set(
      (await Promise.all(
        [
          // hopefully the n_m for the project
          path.resolve(__dirname, '../'),
          // also hopefully the n_m for the project
          path.resolve(projectDir, 'node_modules'),
          // local n_m
          path.resolve(__dirname, '../node_modules'),
          // last resort fallback n_m for the project
          path.resolve(process.cwd(), 'node_modules'),
        ].map(async (path) => {
          try {
            await pfs.accessAsync(path);
            return path;
          } catch (e) {}
          return false;
        }),
      )).filter((x) => !!x),
    ),
  );

  const compiler = webpack(webpackConfig);
  compiler.outputFileSystem = compiler.inputFileSystem = fs;

  return await new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if (err) {
        return rej(err);
      }
      if (!writtenPath) {
        console.log(stats.compilation.errors);
        return rej(new Error('failed to compile'));
      }
      res(fs.readFileSync(writtenPath).toString());
    });
  });
};

module.exports = buildPage;

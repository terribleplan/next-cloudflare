const path = require('path');

const compose = require('./lib/asyncCompose');

const generatePage = require('./stages/generatePage');
const buildPage = require('./stages/buildPage');
const compressPage = require('./stages/compressPage');

const processPath = (...parts) => ['', ...parts].join('/').replace(/\/+/g, '/');

const nextCloudflare = async ({ cwd = process.cwd() }) => {
  const basePath = path.resolve(cwd, '.next');
  const unifiedPath = path.join(basePath, 'unified/index.js');

  // todo: handle static files here, pass them into the main pipeline

  return await compose(
    generatePage,
    buildPage(cwd),
    compressPage,
  )(unifiedPath);
};

module.exports = nextCloudflare;

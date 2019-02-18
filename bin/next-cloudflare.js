#!/usr/bin/env node
const argv = require('minimist')(process.argv.slice(2));
const fs = require('bluebird').promisifyAll(require('fs'));
const path = require('path');

const nextCloudflare = require('../index.js');

const run = async () => {
  let { input } = argv;
  if (!input) {
    input = path.resolve(process.cwd());
    console.log(`WARN: \`--input\` not specified, using \`${input}\``);
  }
  try {
    await fs.accessAsync(input);
  } catch (e) {
    console.log(`FATAL: Unable to access directory ${input}`);
  }

  let { output } = argv;
  if (!output) {
    output = path.resolve(input, 'cloudflare-bundle.js');
    console.log(`WARN: \`--output\` not specified, using \`${output}\``);
  }

  const contents = await nextCloudflare({
    cwd: input,
  });

  if (Buffer.byteLength(contents) > 1048576) {
    console.log(`WARN: Bundle size exceeds 1MB, it may not be accepted`);
  }

  await fs.writeFileAsync(output, contents);
};

run().then(
  () => {
    console.log('INFO: Built cloudflare bundle ok');
    process.exit(0);
  },
  (e) => {
    console.log('INFO: Failed to build cloudflare bundle');
    console.log(e);
    process.exit(1);
  },
);

# @terribleplan/next-cloudflare

This is pretty rough right now, but it works and can hopefully used to foster discussion in the next.js project around a different/better/additional serverless interface.

## Quickstart

1. Set up [my fork of next.js](https://github.com/terribleplan/next.js).
   1. `git clone https://github.com/terribleplan/next.js`
   1. `yarn && pushd packages/next-server && npm link && popd && pushd packages/next && npm link && npm link next-server && popd`
1. Install this package to your project, and use my forked next
   1. `yarn add @terribleplan/next-cloudflare && npm link next`
   2. Edit your `next.config.js` to have `target: 'unified',`.
1. Build things
   1. `npx next build && npx next-cloudflare`

## Usage

This package is usable as an npm module as well as a CLI.

### CLI

#### --input

The project directory that houses the .next build output directory. Defaults to whatever directory the command is invoked from.

This is passed as `cwd` to the programmatic API

#### --output

Where to write the output to. Defaults to `cloudflare-bundle.js` in the input directory (which defaults to the current working directory).

### API

#### Usage

```
const nextCloudflare = require('@terribleplan/next-cloudflare');

const bundleString = await nextCloudflare(options);

console.log(bundleString);
```

#### options.cwd

The project directory that houses the .next build output directory. Defaults to `process.cwd()`.

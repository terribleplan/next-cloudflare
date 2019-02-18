const terser = require('terser');

const compressPage = (page) =>
  terser.minify(page, {
    toplevel: true,
    compress: {
      passes: 3,
      unsafe: false,
      pure_getters: true,
    },
  }).code;

module.exports = compressPage;

// todo: figure out at what point this isn't necessary.
// path-browserify supposedly added support for .posix at some point
const path = require('path-browserify');
module.exports.posix = require('path-browserify');

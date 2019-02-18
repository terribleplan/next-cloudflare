const path = require('path');

const makePageString = (pagePath) => `
const page = require(${JSON.stringify(pagePath)});
const adapter = require(${JSON.stringify(
  path.resolve(__dirname, '../lib/adapter'),
)})

const handler = adapter(page);

addEventListener('fetch', (event) => {
  event.respondWith(handler(event.request));
});
`;

module.exports = makePageString;

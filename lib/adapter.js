const url = require('url');

module.exports = (page) => {
  const handler = async (request) => {
    const { pathname, query } = url.parse(request.url, true);

    // todo: figure out static asset serving
    if (pathname.startsWith('/_next/')) {
      return new Response('', {
        status: 404,
      });
    }

    const { status, headers, body } = await page.render(pathname, query);

    // todo: consider etag handling
    return new Response(body, {
      status,
      headers: new Headers(headers),
    });
  };

  return handler;
};

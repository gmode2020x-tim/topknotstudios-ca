export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const assetResponse = await env.ASSETS.fetch(request);

    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    if (url.pathname.startsWith("/assets/")) {
      return assetResponse;
    }

    return env.ASSETS.fetch(new Request(new URL("/index.html", request.url)));
  }
};

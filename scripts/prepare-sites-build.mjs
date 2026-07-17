import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");

const manifest = {
  html: await readFile("dist/index.html", "utf8"),
  css: await readFile("dist/assets/index-DHYf1GET.css", "utf8"),
  js: await readFile("dist/assets/index-Br5aYANE.js", "utf8"),
};

await writeFile(
  "dist/server/index.js",
  `const assets = ${JSON.stringify(manifest)};\n\n` +
    `function response(body, contentType) {\n` +
    `  return new Response(body, { headers: { "content-type": contentType } });\n` +
    `}\n\n` +
    `export default {\n` +
    `  async fetch(request) {\n` +
    `    const pathname = new URL(request.url).pathname;\n` +
    `    if (pathname.endsWith(".css")) return response(assets.css, "text/css; charset=utf-8");\n` +
    `    if (pathname.endsWith(".js")) return response(assets.js, "text/javascript; charset=utf-8");\n` +
    `    return response(assets.html, "text/html; charset=utf-8");\n` +
    `  }\n` +
    `};\n`,
);

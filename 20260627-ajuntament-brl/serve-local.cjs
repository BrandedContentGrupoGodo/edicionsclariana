const fs = require("fs");
const http = require("http");
const path = require("path");

const root = __dirname;
const port = 8026;
const host = "127.0.0.1";
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const relativePath = urlPath === "/" ? "/index.html" : urlPath;
    const filePath = path.normalize(path.join(root, relativePath));

    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
    });
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(port, host);

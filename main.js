import http from 'http';
import { Command } from 'commander';
import { existsSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

const program = new Command();
program
  .requiredOption('--host <host>', 'Host address')
  .requiredOption('--port <port>', 'Port number')
  .requiredOption('--cache <path>', 'Cache directory');
program.parse(process.argv);

const options = program.opts();
const cacheDir = options.cache;

if (!existsSync(cacheDir)) {
  await fs.mkdir(cacheDir, { recursive: true });
}

const server = http.createServer(async (req, res) => {
  const code = req.url.slice(1);
  const filePath = path.join(cacheDir, `${code}.jpg`);

  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  } else if (req.method === 'PUT') {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);
    await fs.writeFile(filePath, body);
    res.writeHead(201);
    res.end('Created');
  } else if (req.method === 'DELETE') {
    try {
      await fs.unlink(filePath);
      res.writeHead(200);
      res.end('Deleted');
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  } else {
    res.writeHead(405);
    res.end('Method Not Allowed');
  }
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}`);
});
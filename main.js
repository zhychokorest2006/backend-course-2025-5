import http from 'http';
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';

const program = new Command();
program
  .requiredOption('--host <host>', 'Host address')
  .requiredOption('--port <port>', 'Port number')
  .requiredOption('--cache <path>', 'Cache directory');
program.parse(process.argv);

const options = program.opts();

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Proxy server is running');
});

server.listen(options.port, options.host, () => {
  console.log(`Server running at http://${options.host}:${options.port}`);
});
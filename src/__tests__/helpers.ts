import http from 'http';
import { promisify } from 'util';

export async function createTestServer(
  stories: http.RequestListener[],
): Promise<{ server: http.Server; port: number }> {
  const server = http.createServer();

  await promisify(server.listen).apply(server);

  const serverInfo = server.address();
  if (serverInfo === null || typeof serverInfo === 'string') {
    throw new Error('Failed to setup a test server.');
  }

  server.on('request', (req, res) => {
    const listener = stories.shift();
    if (listener !== undefined) {
      listener(req, res);
    }
    if (stories.length === 0) {
      server.close();
    }
  });

  return {
    server,
    port: serverInfo.port,
  };
}

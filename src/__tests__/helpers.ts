import http from 'node:http';
import { promisify } from 'node:util';

export async function createTestServer(
  stories: http.RequestListener[],
): Promise<{ [Symbol.dispose]: () => void; port: number }> {
  const server = http.createServer();

  await promisify(server.listen).apply(server);

  const serverInfo = server.address();
  if (serverInfo == null || typeof serverInfo === 'string') {
    throw new Error('Failed to setup a test server.');
  }

  server.on('request', (req, res) => {
    const listener = stories.shift();
    listener?.(req, res);
  });

  return {
    [Symbol.dispose]: () => {
      server.close();
    },
    port: serverInfo.port,
  };
}

import http from 'node:http';
import { promisify } from 'node:util';

export async function createTestServer(
  stories: http.RequestListener[],
): Promise<{ port: number; server: http.Server }> {
  const server = http.createServer();

  await promisify(server.listen).apply(server);

  const serverInfo = server.address();
  if (serverInfo == null || typeof serverInfo === 'string') {
    throw new Error('Failed to setup a test server.');
  }

  server.on('request', (req, res) => {
    const listener = stories.shift();
    if (listener != null) {
      listener(req, res);
    }
    if (stories.length === 0) {
      server.close();
    }
  });

  return {
    port: serverInfo.port,
    server,
  };
}

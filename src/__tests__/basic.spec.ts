import test from 'ava';
import http from 'http';
import https from 'https';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';

import { wrapper } from '../';
import { createTestServer } from './helpers';

test.before(() => {
  wrapper(axios);
});

test.serial('should receive response correctly', async (t) => {
  const { port } = await createTestServer([
    (_req, res) => {
      res.end('Hello World!');
    },
  ]);

  const jar = new CookieJar();

  const { status, data } = await axios.get(`http://localhost:${port}`, { jar, responseType: 'text' });
  t.is(status, 200);
  t.is(data, 'Hello World!');

  t.plan(2);
});

test.serial('should store cookies to cookiejar', async (t) => {
  const { port } = await createTestServer([
    (_req, res) => {
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();

  await axios.get(`http://localhost:${port}`, { jar });

  const cookies = await jar.getCookies(`http://localhost:${port}`);
  t.like(cookies, {
    0: { key: 'key', value: 'value' },
  });

  t.plan(1);
});

test.serial('should send cookies from cookiejar', async (t) => {
  const { port } = await createTestServer([
    (req, res) => {
      t.is(req.headers['cookie'], 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();
  await jar.setCookie('key=value', `http://localhost:${port}`);

  await axios.get(`http://localhost:${port}`, { jar });

  t.plan(1);
});

test.serial('should merge cookies from cookiejar and cookie header', async (t) => {
  const { port } = await createTestServer([
    (req, res) => {
      t.is(req.headers['cookie'], 'key1=value1; key2=value2');
      res.end();
    },
  ]);

  const jar = new CookieJar();
  await jar.setCookie('key1=value1', `http://localhost:${port}`);

  await axios.get(`http://localhost:${port}`, {
    jar,
    headers: { Cookie: 'key2=value2' },
  });

  t.plan(1);
});

test.serial('should send cookies which received first request when redirecting to same domain', async (t) => {
  const { port } = await createTestServer([
    (_req, res) => {
      res.statusCode = 301;
      res.setHeader('Location', '/another-path');
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
    (req, res) => {
      t.is(req.headers['cookie'], 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();

  await axios.get(`http://localhost:${port}`, { jar });

  t.plan(1);
});

test.serial('should not send cookies which received first request when redirecting to another domain', async (t) => {
  const { port } = await createTestServer([
    (_req, res) => {
      res.statusCode = 301;
      res.setHeader('Location', `http://127.0.0.1:${port}`);
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
    (req, res) => {
      t.false('cookie' in req.headers);
      res.end();
    },
  ]);

  const jar = new CookieJar();

  await axios.get(`http://localhost:${port}`, { jar });

  t.plan(1);
});

test.serial('should send cookies even when target is same host but different port', async (t) => {
  const { port: firstServerPort } = await createTestServer([
    (_req, res) => {
      res.setHeader('Set-Cookie', 'key=expected');
      res.end();
    },
  ]);

  const { port: secondServerPort } = await createTestServer([
    (req, res) => {
      t.is(req.headers['cookie'], 'key=expected');
      res.end();
    },
  ]);

  const jar = new CookieJar();

  await axios.get(`http://localhost:${firstServerPort}`, { jar });
  await axios.get(`http://localhost:${secondServerPort}`, { jar });

  t.plan(1);
});

test.serial('should throw error when config.httpAgent was assigned', async (t) => {
  const { server, port } = await createTestServer([
    (_req, res) => {
      res.end();
    },
  ]);

  const jar = new CookieJar();

  await t.throwsAsync(
    async () => {
      await axios.get(`http://localhost:${port}`, { jar, httpAgent: new http.Agent() });
    },
    {
      message: 'axios-cookiejar-support does not support for use with other http(s).Agent.',
    },
  );

  t.plan(1);
  server.close();
});

test.serial('should throw error when config.httpsAgent was assigned', async (t) => {
  const { server, port } = await createTestServer([
    (_req, res) => {
      res.end();
    },
  ]);

  const jar = new CookieJar();

  await t.throwsAsync(
    async () => {
      await axios.get(`http://localhost:${port}`, { jar, httpsAgent: new https.Agent() });
    },
    {
      message: 'axios-cookiejar-support does not support for use with other http(s).Agent.',
    },
  );

  t.plan(1);
  server.close();
});

test.serial('should throw error when config.jar was assigned with boolean', async (t) => {
  const { server, port } = await createTestServer([
    (_req, res) => {
      res.end();
    },
  ]);

  await t.throwsAsync(
    async () => {
      await axios.get(`http://localhost:${port}`, {
        // @ts-expect-error
        jar: true,
      });
    },
    {
      message: 'config.jar does not accept boolean since axios-cookiejar-support@2.0.0.',
    },
  );

  t.plan(1);
  server.close();
});

import http from 'node:http';
import https from 'node:https';

import { beforeAll, expect, test } from '@jest/globals';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';

import { wrapper } from '../';

import { createTestServer } from './helpers';

beforeAll(() => {
  wrapper(axios);
});

test('should receive response correctly', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.end('Hello World!');
    },
  ]);

  const jar = new CookieJar();

  const actual = await axios.get(`http://localhost:${server.port.toString(10)}`, { jar, responseType: 'text' });
  expect(actual).toMatchObject({
    data: 'Hello World!',
    status: 200,
  });
});

test('should store cookies to cookiejar', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();

  await axios.get(`http://localhost:${server.port.toString(10)}`, { jar });

  const actual = await jar.getCookies(`http://localhost:${server.port.toString(10)}`);
  expect(actual).toMatchObject([{ key: 'key', value: 'value' }]);
});

test('should send cookies from cookiejar', async () => {
  using server = await createTestServer([
    (req, res) => {
      res.write(req.headers['cookie']);
      res.end();
    },
  ]);

  const jar = new CookieJar();
  await jar.setCookie('key=value', `http://localhost:${server.port.toString(10)}`);

  const { data: actual } = await axios.get<string>(`http://localhost:${server.port.toString(10)}`, {
    jar,
    responseType: 'text',
  });
  expect(actual).toBe('key=value');
});

test('should merge cookies from cookiejar and cookie header', async () => {
  using server = await createTestServer([
    (req, res) => {
      res.write(req.headers['cookie']);
      res.end();
    },
  ]);

  const jar = new CookieJar();
  await jar.setCookie('key1=value1', `http://localhost:${server.port.toString(10)}`);

  const { data: actual } = await axios.get<string>(`http://localhost:${server.port.toString(10)}`, {
    headers: { Cookie: 'key2=value2' },
    jar,
    responseType: 'text',
  });
  expect(actual).toBe('key1=value1; key2=value2');
});

test('should send cookies which received first request when redirecting to same domain', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.statusCode = 301;
      res.setHeader('Location', '/another-path');
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
    (req, res) => {
      res.write(req.headers['cookie']);
      res.end();
    },
  ]);

  const jar = new CookieJar();

  const { data: actual } = await axios.get<string>(`http://localhost:${server.port.toString(10)}`, {
    jar,
    responseType: 'text',
  });
  expect(actual).toBe('key=value');
});

test('should not send cookies which received first request when redirecting to another domain', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.statusCode = 301;
      res.setHeader('Location', `http://127.0.0.1:${server.port.toString(10)}`);
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
    (req, res) => {
      res.write(JSON.stringify(req.headers));
      res.end();
    },
  ]);

  const jar = new CookieJar();

  const { data: actual } = await axios.get<object>(`http://localhost:${server.port.toString(10)}`, {
    jar,
    responseType: 'json',
  });
  expect(actual).not.toHaveProperty('cookie');
});

test('should send cookies even when target is same host but different port', async () => {
  using firstServer = await createTestServer([
    (_req, res) => {
      res.setHeader('Set-Cookie', 'key=expected');
      res.end();
    },
  ]);

  using secondServer = await createTestServer([
    (req, res) => {
      res.write(req.headers['cookie']);
      res.end();
    },
  ]);

  const jar = new CookieJar();

  await axios.get(`http://localhost:${firstServer.port.toString(10)}`, { jar });
  const { data: actual } = await axios.get<string>(`http://localhost:${secondServer.port.toString(10)}`, {
    jar,
    responseType: 'text',
  });
  expect(actual).toBe('key=expected');
});

test('should throw error when config.httpAgent was assigned', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.end();
    },
  ]);

  const jar = new CookieJar();

  const actual = axios.get(`http://localhost:${server.port.toString(10)}`, { httpAgent: new http.Agent(), jar });
  await expect(actual).rejects.toThrowError({
    message: 'axios-cookiejar-support does not support for use with other http(s).Agent.',
  });
});

test('should throw error when config.httpsAgent was assigned', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.end();
    },
  ]);

  const jar = new CookieJar();

  const actual = axios.get(`http://localhost:${server.port.toString(10)}`, { httpsAgent: new https.Agent(), jar });
  await expect(actual).rejects.toThrowError({
    message: 'axios-cookiejar-support does not support for use with other http(s).Agent.',
  });
});

test('should throw error when config.jar was assigned with boolean', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.end();
    },
  ]);

  const actual = axios.get(`http://localhost:${server.port.toString(10)}`, {
    // @ts-expect-error -- Legacy version allows to assign boolean as jar.
    jar: true,
  });
  await expect(actual).rejects.toThrowError({
    message: 'config.jar does not accept boolean since axios-cookiejar-support@2.0.0.',
  });
});

test('should allow to reuse config', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.end('Hello World!');
    },
    (_req, res) => {
      res.end('Hello World!');
    },
  ]);

  const jar = new CookieJar();

  const { config } = await axios.get(`http://localhost:${server.port.toString(10)}`, { jar, responseType: 'text' });
  const actual = axios.get(`http://localhost:${server.port.toString(10)}`, config);
  await expect(actual).resolves.not.toThrowError();
});

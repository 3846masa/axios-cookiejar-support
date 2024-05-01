import { beforeAll, expect, test } from '@jest/globals';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';

import { wrapper } from '../';

import { createTestServer } from './helpers';

beforeAll(() => {
  wrapper(axios);
});

test('should store cookies to cookiejar when using instance', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();
  const client = axios.create({ jar });

  await client.get(`http://localhost:${server.port.toString(10)}`);

  const actual = await jar.getCookies(`http://localhost:${server.port.toString(10)}`);
  expect(actual).toMatchObject([{ key: 'key', value: 'value' }]);
});

test('should send cookies from cookiejar when using instance', async () => {
  using server = await createTestServer([
    (req, res) => {
      res.write(req.headers['cookie']);
      res.end();
    },
  ]);

  const jar = new CookieJar();
  const client = axios.create({ jar });
  await jar.setCookie('key=value', `http://localhost:${server.port.toString(10)}`);

  const { data: actual } = await client.get<string>(`http://localhost:${server.port.toString(10)}`, {
    responseType: 'text',
  });
  expect(actual).toBe('key=value');
});

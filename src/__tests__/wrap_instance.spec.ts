import { expect, test } from '@jest/globals';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';

import { wrapper } from '../';

import { createTestServer } from './helpers';

test('should store cookies to cookiejar when instance was wrapped', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  await client.get(`http://localhost:${server.port}`);

  const actual = await jar.getCookies(`http://localhost:${server.port}`);
  expect(actual).toMatchObject([{ key: 'key', value: 'value' }]);
});

test('should send cookies from cookiejar when instance was wrapped', async () => {
  using server = await createTestServer([
    (req, res) => {
      res.write(req.headers['cookie']);
      res.end();
    },
  ]);

  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));
  await jar.setCookie('key=value', `http://localhost:${server.port}`);

  const { data: actual } = await client.get(`http://localhost:${server.port}`, { responseType: 'text' });
  expect(actual).toBe('key=value');
});

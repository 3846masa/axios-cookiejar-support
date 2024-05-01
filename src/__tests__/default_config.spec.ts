import { afterEach, beforeAll, expect, test } from '@jest/globals';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';

import { wrapper } from '../';

import { createTestServer } from './helpers';

beforeAll(() => {
  wrapper(axios);
});

afterEach(() => {
  delete axios.defaults.jar;
});

test('should store cookies to cookiejar when default.jar was assigned', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();
  axios.defaults.jar = jar;

  await axios.get(`http://localhost:${server.port.toString(10)}`);

  const actual = await jar.getCookies(`http://localhost:${server.port.toString(10)}`);
  expect(actual).toMatchObject([{ key: 'key', value: 'value' }]);
});

test('should send cookies from cookiejar when default.jar was assigned', async () => {
  using server = await createTestServer([
    (req, res) => {
      res.write(req.headers['cookie']);
      res.end();
    },
  ]);

  const jar = new CookieJar();
  axios.defaults.jar = jar;
  await jar.setCookie('key=value', `http://localhost:${server.port.toString(10)}`);

  const { data: actual } = await axios.get<string>(`http://localhost:${server.port.toString(10)}`, {
    responseType: 'text',
  });
  expect(actual).toBe('key=value');
});

test('should use config.cookiejar in preference to default.jar', async () => {
  using server = await createTestServer([
    (req, res) => {
      res.write(req.headers['cookie']);
      res.end();
    },
  ]);

  const defaultJar = new CookieJar();
  axios.defaults.jar = defaultJar;
  await defaultJar.setCookie('key=default', `http://localhost:${server.port.toString(10)}`);

  const configJar = new CookieJar();
  await configJar.setCookie('key=config', `http://localhost:${server.port.toString(10)}`);

  const { data: actual } = await axios.get<string>(`http://localhost:${server.port.toString(10)}`, {
    jar: configJar,
    responseType: 'text',
  });
  expect(actual).toBe('key=config');
});

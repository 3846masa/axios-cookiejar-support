import test from 'ava';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';

import { wrapper } from '../';
import { createTestServer } from './helpers';

test.before(() => {
  wrapper(axios);
});

test.serial.afterEach.always(() => {
  delete axios.defaults.jar;
});

test.serial('should store cookies to cookiejar when default.jar was assigned', async (t) => {
  const { port } = await createTestServer([
    (_req, res) => {
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();
  axios.defaults.jar = jar;

  await axios.get(`http://localhost:${port}`);

  const cookies = await jar.getCookies(`http://localhost:${port}`);
  t.like(cookies, {
    0: { key: 'key', value: 'value' },
  });

  t.plan(1);
});

test.serial('should send cookies from cookiejar when default.jar was assigned', async (t) => {
  const { port } = await createTestServer([
    (req, res) => {
      t.is(req.headers['cookie'], 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();
  axios.defaults.jar = jar;
  await jar.setCookie('key=value', `http://localhost:${port}`);

  await axios.get(`http://localhost:${port}`);

  t.plan(1);
});

test.serial('should use config.cookiejar in preference to default.jar', async (t) => {
  const { port } = await createTestServer([
    (req, res) => {
      t.is(req.headers['cookie'], 'key=config');
      res.end();
    },
  ]);

  const defaultJar = new CookieJar();
  axios.defaults.jar = defaultJar;
  await defaultJar.setCookie('key=default', `http://localhost:${port}`);

  const configJar = new CookieJar();
  await configJar.setCookie('key=config', `http://localhost:${port}`);

  await axios.get(`http://localhost:${port}`, { jar: configJar });

  t.plan(1);
});

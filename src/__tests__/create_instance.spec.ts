import test from 'ava';
import axios from 'axios';
import { CookieJar } from 'tough-cookie';

import { wrapper } from '../';
import { createTestServer } from './helpers';

test.before(() => {
  wrapper(axios);
});

test.serial('should store cookies to cookiejar when using instance', async (t) => {
  const { port } = await createTestServer([
    (_req, res) => {
      res.setHeader('Set-Cookie', 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();
  const client = axios.create({ jar });

  await client.get(`http://localhost:${port}`);

  const cookies = await jar.getCookies(`http://localhost:${port}`);
  t.like(cookies, {
    0: { key: 'key', value: 'value' },
  });

  t.plan(1);
});

test.serial('should send cookies from cookiejar when using instance', async (t) => {
  const { port } = await createTestServer([
    (req, res) => {
      t.is(req.headers['cookie'], 'key=value');
      res.end();
    },
  ]);

  const jar = new CookieJar();
  const client = axios.create({ jar });
  await jar.setCookie('key=value', `http://localhost:${port}`);

  await client.get(`http://localhost:${port}`);

  t.plan(1);
});

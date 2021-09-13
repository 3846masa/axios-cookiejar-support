import test from 'ava';
import axios from 'axios';

import { wrapper } from '../';
import { createTestServer } from './helpers';

test.before(() => {
  wrapper(axios);
});

test.serial('should receive response correctly without cookiejar', async (t) => {
  const { port } = await createTestServer([
    (_req, res) => {
      res.end('Hello World!');
    },
  ]);

  const { status, data } = await axios.get(`http://localhost:${port}`, { responseType: 'text' });
  t.is(status, 200);
  t.is(data, 'Hello World!');

  t.plan(2);
});

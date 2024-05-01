import { beforeAll, expect, test } from '@jest/globals';
import axios from 'axios';

import { wrapper } from '../';

import { createTestServer } from './helpers';

beforeAll(() => {
  wrapper(axios);
});

test('should receive response correctly without cookiejar', async () => {
  using server = await createTestServer([
    (_req, res) => {
      res.end('Hello World!');
    },
  ]);

  const actual = await axios.get(`http://localhost:${server.port.toString(10)}`, { responseType: 'text' });
  expect(actual).toMatchObject({
    data: 'Hello World!',
    status: 200,
  });
});

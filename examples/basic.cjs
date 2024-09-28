/* eslint-disable @typescript-eslint/no-require-imports */
'use strict';

const { default: axios } = require('axios');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

void client.get('https://httpbin.org/cookies/set/session/userid').then(({ config }) => {
  console.log(config.jar?.toJSON());
});

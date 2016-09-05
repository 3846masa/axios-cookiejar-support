'use strict';

const axios = require('axios');
const tough = require('tough-cookie');
const axiosCookieJarSupport = require('../');

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();
cookieJar.setCookieSync('key=value; domain=mockbin.org', 'https://mockbin.org');

axios.get('https://mockbin.org/request', {
  jar: cookieJar,
  withCredentials: true // IMPORTANT!
})
.then((response) => {
  const data = response.data;
  console.log(data.headers.cookie);
})
.catch((err) => {
  console.error(err.stack || err);
});

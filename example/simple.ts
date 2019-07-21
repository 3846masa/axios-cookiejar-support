import axios from 'axios';
import tough = require('tough-cookie');
import axiosCookieJarSupport from 'axios-cookiejar-support';

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();

axios
  .get('https://google.com', {
    jar: cookieJar,
    withCredentials: true,
  })
  .then((response) => {
    const config = response.config;
    console.log(config.jar);
  })
  .catch((err) => {
    console.error(err.stack || err);
  });

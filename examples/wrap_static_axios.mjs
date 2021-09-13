import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

wrapper(axios);

const jar = new CookieJar();
const { config } = await axios.get('https://httpbin.org/cookies/set/session/userid', {
  jar,
});

console.log(config.jar.toJSON());

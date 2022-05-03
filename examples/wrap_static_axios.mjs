import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

wrapper(axios);

const jar = new CookieJar();
const { config } = await axios.get('https://httpbin.org/cookies/set/session/userid', {
  jar,
});

console.log(config.jar.toJSON());

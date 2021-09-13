import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const { config } = await client.get('https://httpbin.org/cookies/set/session/userid');

console.log(config.jar.toJSON());

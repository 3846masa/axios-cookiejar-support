import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

async function main() {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar }));

  const { config } = await client.get('https://httpbin.org/cookies/set/session/userid');

  console.log(config.jar?.toJSON());
}

void main();

# axios-cookiejar-support

![axios-cookiejar-support](./docs/assets/ogp.jpg)

[![github sponsors](https://flat.badgen.net/badge/GitHub%20Sponsors/Support%20me%20%E2%9D%A4/ff69b4?icon=github)](https://github.com/sponsors/3846masa)
[![npm](https://flat.badgen.net/npm/v/axios-cookiejar-support)](https://www.npmjs.com/package/axios-cookiejar-support)
[![license](https://flat.badgen.net/badge/license/MIT/blue)](LICENSE)
[![standard-readme compliant](https://flat.badgen.net/badge/readme%20style/standard/green)](https://github.com/RichardLitt/standard-readme)

Add `tough-cookie` support to axios.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Extended Request Config](#extended-request-config)
- [Contributing](#contributing)
- [License](#license)

## Install

```
npm install axios tough-cookie axios-cookiejar-support
```

## Usage

```js
import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

await client.get('https://example.com');
```

See [examples](./examples) for more details.

### Extended Request Config

```ts
import type { CookieJar } from 'tough-cookie';

declare module 'axios' {
  interface AxiosRequestConfig {
    jar?: CookieJar;
  }
}
```

See also https://github.com/axios/axios#request-config .

## FAQ

- Q. Why can't I assign the httpAgent / httpsAgent?
  - A. axios-cookiejar-support uses httpAgent / httpsAgent to read and write cookies. If other Agents are assigned, cookies cannot be read/written.
- Q. I want to use it with another Agent (e.g., http-proxy-agent).
  - A. Consider using http-cookie-agent. axios-cookiejar-support also uses http-cookie-agent. Read http-cookie-agent's README for more details.

## Contributing

PRs accepted.

## License

[MIT (c) 3846masa](./LICENSE)

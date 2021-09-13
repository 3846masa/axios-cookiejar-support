# axios-cookiejar-support

![axios-cookiejar-support](./docs/assets/ogp.jpg)

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

## Contributing

PRs accepted.

## License

[MIT (c) 3846masa](./LICENSE)

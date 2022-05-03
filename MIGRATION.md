# MIGRATION GUIDES

## Migration guide from v2.x.x to v3.0.0

- [Update requirements.](#update-requirements)

### Update requirements.

- Node.js v14.18.0 / v16.0.0 or above

## Migration guide from v1.0.x to v2.0.0

- [Update requirements.](#update-requirements-1)
- [The wrapper function are exported as "named exports".](#the-wrapper-function-are-exported-as-named-exports)
- [No longer refers to `config.withCredentials`.](#no-longer-refers-to-configwithcredentials)
- [`config.httpAgent` / `config.httpsAgent` cannot use with `axios-cookiejar-support`.](#confighttpagent--confighttpsagent-cannot-use-with-axios-cookiejar-support)
- [`config.jar` no longer accepts boolean.](#configjar-no-longer-accepts-boolean)
- [Invalid cookies will always be ignored.](#invalid-cookies-will-always-be-ignored)

### Update requirements.

- Node.js v12.19.0 / v14.5.0 or above
- `axios@0.20.0` or above
- `tough-cookie@4.0.0` or above

### The wrapper function are exported as "named exports".

```diff
  // CommonJS
- const axiosCookieJarSupport = require('axios-cookiejar-support');
+ const { wrapper: axiosCookieJarSupport } = require('axios-cookiejar-support');
```

```diff
  // ES Module
- import axiosCookieJarSupport from 'axios-cookiejar-support';
+ import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
```

### No longer refers to `config.withCredentials`.

```diff
  // Remove config.withCredentials
  axios.get('https://example.com', {
    jar: new CookieJar(),
-   withCredentials: true,
  });
```

If you want to prevent sending cookies, unset `config.jar` directly.

```diff
  // Remove config.jar for preventing to send cookie
  axios.get('https://example.com', {
-   jar: new CookieJar(),
-   withCredentials: false,
  });
```

### `config.httpAgent` / `config.httpsAgent` cannot use with `axios-cookiejar-support`.

`http-cookie-agent` allows to use another Agent with CookieJar.

```js
import axios from 'axios';
import { CookieJar } from 'tough-cookie';
import { createCookieAgent } from 'http-cookie-agent';
import httpProxyAgent from 'http-proxy-agent';
import httpsProxyAgent from 'https-proxy-agent';

const HttpProxyCookieAgent = createCookieAgent(httpProxyAgent.HttpProxyAgent);
const HttpsProxyCookieAgent = createCookieAgent(httpsProxyAgent.HttpsProxyAgent);

const jar = new CookieJar();
const client = axios.create({
  httpAgent: new HttpProxyCookieAgent({ jar, hostname: '127.0.0.1', port: 8080 }),
  httpsAgent: new HttpsProxyCookieAgent({ jar, hostname: '127.0.0.1', port: 8080 }),
});

await client.get('https://example.com');
```

### `config.jar` no longer accepts boolean.

```diff
  // Cannot use boolean as config.jar since v2.x
+ const cookieJar = new CookieJar();
  axios.get('https://example.com', {
-   jar: true,
+   jar: cookieJar,
  });
```

### Invalid cookies will always be ignored.

Up to v1.x, `axios-cookie-jar` throws an error by default when a client receives invalid cookies.

However, since v2.0, `axios-cookie-jar` will always ignore invalid cookies.

```diff
  const cookieJar = new CookieJar();
  axios.get('https://example.com', {
    jar: cookieJar,
-   ignoreCookieErrors: true,
  });
```

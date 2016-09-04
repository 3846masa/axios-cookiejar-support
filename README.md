# axios-cookiejar-support

Add [``tough-cookie``] support to [``axios``].

[``axios``]: https://github.com/mzabriskie/axios
[``tough-cookie``]: https://github.com/SalesforceEng/tough-cookie

------
[![NPM](https://img.shields.io/npm/v/@3846masa/axios-cookiejar-support.svg?style=flat-square)][npm]
[![LICENSE](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)][license]
[![CircleCI](https://img.shields.io/circleci/project/3846masa/axios-cookiejar-support/master.svg?style=flat-square)][circleci]

[npm]: https://www.npmjs.com/package/@3846masa/axios-cookiejar-support
[license]: https://3846masa.mit-license.org
[circleci]: https://circleci.com/gh/3846masa/axios-cookiejar-support

## Install

```sh
$ npm i axios @3846masa/axios-cookiejar-support
```

## Usage

```js
const axios = require('axios');
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support');
const tough = require('tough-cookie');

axiosCookieJarSupport(axios);

const cookieJar = new tough.CookieJar();

axios.get('https://google.com', {
  jar: cookieJar, // tough.CookieJar or boolean
  withCredentials: true // If true, send cookie stored in jar
})
.then(() => {
  console.log(cookieJar);
});
```

### Browser

Running on browser, this library becomes noop (``config.jar`` might be ignored).

## Contribution

1. [Fork it]
2. Create your feature branch (``git checkout -b my-new-feature``)
3. Commit your changes (``git commit -am 'Add some feature'``)
4. Push to the branch (``git push origin my-new-feature``)
5. Create new Pull Request

[Fork it]: http://github.com/3846masa/axios-cookiejar-support/fork

## LICENSE

[MIT License](https://3846masa.mit-license.org)

## Author

![3846masa icon](https://www.gravatar.com/avatar/cfeae69aae4f4fc102960f01d35d2d86?s=50)
[3846masa](https://github.com/3846masa)

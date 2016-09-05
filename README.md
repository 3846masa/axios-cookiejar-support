# axios-cookiejar-support

Add [``tough-cookie``] support to [``axios``].

[``axios``]: https://github.com/mzabriskie/axios
[``tough-cookie``]: https://github.com/SalesforceEng/tough-cookie

------
[![NPM][npm-badge]][npm]
[![LICENSE][license-badge]][license]
[![CircleCI][circleci-badge]][circleci]

[![dependencies][dependencies-badge]][dependencies-david]
[![peerdependencies][peerdependencies-badge]][peerdependencies-david]
[![devdependencies][devdependencies-badge]][devdependencies-david]

[npm]: https://www.npmjs.com/package/@3846masa/axios-cookiejar-support
[license]: https://3846masa.mit-license.org
[circleci]: https://circleci.com/gh/3846masa/axios-cookiejar-support
[dependencies-david]: https://david-dm.org/3846masa/axios-cookiejar-support?view=list
[peerdependencies-david]: https://david-dm.org/3846masa/axios-cookiejar-support?type=peer&view=list
[devdependencies-david]: https://david-dm.org/3846masa/axios-cookiejar-support?type=dev&view=list

[npm-badge]: https://img.shields.io/npm/v/@3846masa/axios-cookiejar-support.svg?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURcwAAOeIiP////G7u/ri4tIZGdpFReJsbPC3t075sZwAAAAvSURBVCjPY2CgDWAThIMEsACjEhwIUCZg0dGCIqASwMAxMgXAgSzOwMAOC2TqAwBvzR4JxLaP0gAAAABJRU5ErkJggg==
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAIGNIUk0AAHomAACAhAAA%2BgAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAVUExURSBTICJcIiNgIiZoJTuhNyt3Kf///%2BCqxSgAAAAGdFJOUwpclbn%2B4Fj6/H8AAAABYktHRAZhZrh9AAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4AkEEjEV7MDQQwAAAGBJREFUCNc1TUEKgDAMi07vE/Q%2BRD8g%2B4BbvAvi/79iMjDQJm1CC6BbDzRsZI3incIpYeYFhCaYnLiyPYnYkwWZFWoFHrSuttCmmbwXh0eJQYVON4JthZTxCzzAmyb8%2BAAKXBRyN6RyZQAAAABJRU5ErkJggg==
[circleci-badge]: https://img.shields.io/circleci/project/3846masa/axios-cookiejar-support/master.svg?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAAIGNIUk0AAHomAACAhAAA%2BgAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRP///////wlY99wAAAAHdElNRQfgCQQSJS8EYt6kAAAAiklEQVRIx2M41nqs9Xi9WDQh%2BjQQnDnz%2BS5x9KS9xJrLgN/CSXtJs5h0BzHQ1mLCDmEgL4jJpyl0AOG4JTYE4Q6gdqIi1UMM2F1OrE9xBy2xDmGgrs8wHU5nB2CGBNEOQPcBoaigThQA08AgS4QDkA3pXRChe4SBskqHiiUhreoEsmtDyhxEfKIFAG4yoGuqR9fTAAAAAElFTkSuQmCC
[dependencies-badge]: https://img.shields.io/david/3846masa/axios-cookiejar-support.svg?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURcwAAOeIiP////G7u/ri4tIZGdpFReJsbPC3t075sZwAAAAvSURBVCjPY2CgDWAThIMEsACjEhwIUCZg0dGCIqASwMAxMgXAgSzOwMAOC2TqAwBvzR4JxLaP0gAAAABJRU5ErkJggg==
[peerdependencies-badge]: https://img.shields.io/david/peer/3846masa/axios-cookiejar-support.svg?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURcwAAOeIiP////G7u/ri4tIZGdpFReJsbPC3t075sZwAAAAvSURBVCjPY2CgDWAThIMEsACjEhwIUCZg0dGCIqASwMAxMgXAgSzOwMAOC2TqAwBvzR4JxLaP0gAAAABJRU5ErkJggg==
[devdependencies-badge]: https://img.shields.io/david/dev/3846masa/axios-cookiejar-support.svg?style=flat-square&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAbUExURcwAAOeIiP////G7u/ri4tIZGdpFReJsbPC3t075sZwAAAAvSURBVCjPY2CgDWAThIMEsACjEhwIUCZg0dGCIqASwMAxMgXAgSzOwMAOC2TqAwBvzR4JxLaP0gAAAABJRU5ErkJggg==

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

See [examples](./example).

### Extended Request Config

c.f.) https://github.com/mzabriskie/axios#request-config

```js
{
  // `jar` is tough.CookieJar instance or boolean.
  // If true, axios create CookieJar automatically.
  jar: undefined, // default

  // **IMPORTANT**
  // If false, axios DONOT send cookies from cookiejar.
  withCredentials: false // default
}
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

![3846masa icon][3846masa-icon]
[3846masa](https://github.com/3846masa)

[3846masa-icon]: https://www.gravatar.com/avatar/cfeae69aae4f4fc102960f01d35d2d86?s=50

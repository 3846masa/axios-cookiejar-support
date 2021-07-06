'use strict';

function noopEnableCookieJarSupport (instance) {
  return instance;
}

module.exports = noopEnableCookieJarSupport;
module.exports.default = noopEnableCookieJarSupport

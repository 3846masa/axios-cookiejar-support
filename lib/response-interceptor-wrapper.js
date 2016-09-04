'use strict';

const settle = require('axios/lib/core/settle');

function responseInterceptorResolve (response, instance) {
  return Promise.resolve(response)
  .then(function setCookies (response) {
    const config = response.config;
    if (!config.$$__jar || !response.headers['set-cookie']) {
      return response;
    }

    if (Array.isArray(response.headers['set-cookie'])) {
      const cookies = response.headers['set-cookie'];
      cookies.forEach(function (cookie) {
        return config.$$__jar.setCookieSync(cookie, config.url);
      });
    } else {
      const cookie = response.headers['set-cookie'];
      config.$$__jar.setCookieSync(cookie, config.url);
    }

    return response;
  })
  .then(function redirectSetup (response) {
    const config = response.config;

    config.$$__orig.baseURL =
      config.$$__orig.baseURL || config.baseURL;
    config.$$__orig.url =
      config.$$__orig.url || config.url;
    config.$$__orig.method =
      config.$$__orig.method || config.method;

    config.baseURL = undefined;
    config.url = response.headers['location'];

    config.$$__redirectCount--;

    return response;
  })
  .then(function redirect (response) {
    const config = response.config;

    if (config.$$__redirectCount < 0 || !response.headers['location']) {
      return response;
    }
    if (response.status !== 307) {
      config.method = 'get';
    }

    return instance.request(config);
  })
  .then(function restoreCookieJar (response) {
    const config = response.config;
    if (!config.$$__jar) return response;

    if (instance.defaults.jar && (!config.jar || config.jar === true)) {
      instance.defaults.jar = config.$$__jar;
    }
    config.jar = config.$$__jar;

    return response;
  })
  .then(function restoreConfigs (response) {
    const config = response.config;

    for (let key in config.$$__orig) {
      config[key] = config.$$__orig[key];
    }
    for (let key in config.$$__orig) {
      if (!key.match(/^\$\$__/)) continue;
      delete config[key];
    }

    return response;
  })
  .then(function validate (response) {
    return new Promise(function (resolve, reject) {
      settle(resolve, reject, response);
    });
  });
}

function responseInterceptorReject (error) {
  return Promise.reject(error);
}

function responseInterceptorWrapper (instance) {
  instance.interceptors.response.use(
    function (response) {
      return responseInterceptorResolve(response, instance);
    },
    responseInterceptorReject
  );
  return instance;
}

module.exports = responseInterceptorWrapper;

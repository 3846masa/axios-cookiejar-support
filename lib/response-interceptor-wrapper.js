'use strict';

const settle = require('axios/lib/core/settle');

function responseInterceptorResolve (response, instance) {
  return Promise.resolve(response)
  .then(function setCookies (response) {
    const config = response.config;
    const local = config._COOKIEJAR_SUPPORT_LOCAL;
    if (!local.jar || !response.headers['set-cookie']) {
      return response;
    }

    if (Array.isArray(response.headers['set-cookie'])) {
      const cookies = response.headers['set-cookie'];
      cookies.forEach(function (cookie) {
        local.jar.setCookieSync(cookie, config.url);
      });
    } else {
      const cookie = response.headers['set-cookie'];
      local.jar.setCookieSync(cookie, config.url);
    }

    return response;
  })
  .then(function redirectSetup (response) {
    const config = response.config;
    const local = config._COOKIEJAR_SUPPORT_LOCAL;

    local.backupOptions.baseURL =
      local.backupOptions.baseURL || config.baseURL;
    local.backupOptions.url =
      local.backupOptions.url || config.url;
    local.backupOptions.method =
      local.backupOptions.method || config.method;

    config.baseURL = undefined;
    config.url = response.headers['location'];

    local.redirectCount--;

    return response;
  })
  .then(function redirect (response) {
    const config = response.config;
    const local = config._COOKIEJAR_SUPPORT_LOCAL;

    if (local.redirectCount < 0 || !response.headers['location']) {
      return response;
    }
    if (response.status !== 307) {
      config.method = 'get';
    }

    config.maxRedirects = local.redirectCount;
    return instance.request(config);
  })
  .then(function restoreCookieJar (response) {
    const config = response.config;
    const local = config._COOKIEJAR_SUPPORT_LOCAL;
    if (!local || !local.jar) return response;

    if (instance.defaults.jar && (!config.jar || config.jar === true)) {
      instance.defaults.jar = local.jar;
    }
    config.jar = local.jar;

    return response;
  })
  .then(function restoreConfigs (response) {
    const config = response.config;
    const local = config._COOKIEJAR_SUPPORT_LOCAL;
    if (!local) return response;

    for (let key in local.backupOptions) {
      config[key] = local.backupOptions[key];
    }

    return response;
  })
  .then(function deleteLocals (response) {
    delete response.config._COOKIEJAR_SUPPORT_LOCAL;
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

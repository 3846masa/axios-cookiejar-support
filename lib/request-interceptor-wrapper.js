'use strict';

function requestInterceptorResolve (config) {
  return Promise.resolve(config)
  .then(function backupOriginalConfigs (config) {
    config.$$__orig = config.$$__orig || {};
    return config;
  })
  .then(function redirectSetup (config) {
    config.$$__redirectCount =
      isFinite(config.maxRedirects) ? config.maxRedirects : 5;

    config.$$__orig.maxRedirects =
      config.$$__orig.maxRedirects || config.maxRedirects;

    config.$$__orig.validateStatus =
      config.$$__orig.validateStatus || config.validateStatus;

    config.maxRedirects = 0;
    config.validateStatus = undefined;
    return config;
  })
  .then(function cookieSetup (config) {
    if (config.$$__jar && config.withCredentials) {
      const cookieString = config.$$__jar.getCookieStringSync(config.url);
      if (cookieString) {
        config.headers['Cookie'] =
          (config.headers['Cookie'])
          ? cookieString + '; ' + config.headers['Cookie']
          : cookieString;
      }
    }
    return config;
  });
};

function requestInterceptorReject (error) {
  return Promise.reject(error);
};

function requestInterceptorWrapper (instance) {
  instance.interceptors.request.use(
    requestInterceptorResolve,
    requestInterceptorReject
  );
  return instance;
}

module.exports = requestInterceptorWrapper;

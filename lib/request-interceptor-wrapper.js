'use strict';

function requestInterceptorResolve (config) {
  return Promise.resolve(config)
  .then(function backupOriginalConfigs (config) {
    const local = config._COOKIEJAR_SUPPORT_LOCAL;
    local.backupOptions = local.backupOptions || {};
    return config;
  })
  .then(function redirectSetup (config) {
    const local = config._COOKIEJAR_SUPPORT_LOCAL;

    local.redirectCount =
      isFinite(config.maxRedirects) ? config.maxRedirects : 5;

    local.backupOptions.maxRedirects =
      local.backupOptions.maxRedirects || config.maxRedirects;

    local.backupOptions.validateStatus =
      local.backupOptions.validateStatus || config.validateStatus;

    config.maxRedirects = 0;
    config.validateStatus = undefined;

    return config;
  })
  .then(function cookieSetup (config) {
    const local = config._COOKIEJAR_SUPPORT_LOCAL;

    if (local.jar && config.withCredentials) {
      const cookieString = local.jar.getCookieStringSync(config.url);
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

'use strict';

const pify = require('pify');
const isAbsoluteURL = require('axios/lib/helpers/isAbsoluteURL');
const combineURLs = require('axios/lib/helpers/combineURLs');

function requestInterceptorResolve(config) {
  return Promise.resolve(config)
    .then(function backupOriginalConfigs(config) {
      const local = config._COOKIEJAR_SUPPORT_LOCAL;
      local.backupOptions = local.backupOptions || {};
      return config;
    })
    .then(function redirectSetup(config) {
      const local = config._COOKIEJAR_SUPPORT_LOCAL;

      local.redirectCount = isFinite(config.maxRedirects) ? config.maxRedirects : 5;

      local.backupOptions.maxRedirects = local.backupOptions.maxRedirects || config.maxRedirects;

      local.backupOptions.validateStatus = local.backupOptions.validateStatus || config.validateStatus;

      config.maxRedirects = 0;
      config.validateStatus = undefined;

      return config;
    })
    .then(function cookieSetup(config) {
      const local = config._COOKIEJAR_SUPPORT_LOCAL;

      if (local.jar && config.withCredentials) {
        const getCookieString = pify(local.jar.getCookieString.bind(local.jar));

        const requestUrl =
          config.baseURL && !isAbsoluteURL(config.url) ? combineURLs(config.baseURL, config.url) : config.url;
        return getCookieString(requestUrl)
          .then(function(cookieString) {
            if (!cookieString) {
              return;
            }
            config.headers['Cookie'] = config.headers['Cookie']
              ? cookieString + '; ' + config.headers['Cookie']
              : cookieString;
          })
          .then(function() {
            return config;
          });
      }

      return config;
    });
}

function requestInterceptorReject(error) {
  return Promise.reject(error);
}

function requestInterceptorWrapper(instance) {
  instance.interceptors.request.use(requestInterceptorResolve, requestInterceptorReject);
  return instance;
}

module.exports = requestInterceptorWrapper;

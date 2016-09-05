'use strict';

const tough = require('tough-cookie');
const utils = require('axios/lib/utils');
const requestInterceptorWrapper = require('./lib/request-interceptor-wrapper');
const responseInterceptorWrapper = require('./lib/response-interceptor-wrapper');

function axiosCookieJarSupport (instance) {
  if (instance.create) {
    const createInstance = instance.create.bind(instance);
    instance.create = function create (defaultConfig) {
      const newInstance = createInstance(defaultConfig);
      return axiosCookieJarSupport(newInstance);
    };
  }

  const origRequest = instance.request.bind(instance);
  instance.request = function request (config) {
    config._COOKIEJAR_SUPPORT_LOCAL =
      config._COOKIEJAR_SUPPORT_LOCAL || {};
    const local = config._COOKIEJAR_SUPPORT_LOCAL;

    if (instance.defaults.jar === true) {
      instance.defaults.jar = new tough.CookieJar();
    }
    if (!local.jar) {
      if (config.jar === true) {
        local.jar = (instance.defaults.jar || new tough.CookieJar());
      } else if (config.jar === false) {
        local.jar = false;
      } else {
        local.jar = (config.jar || instance.defaults.jar);
      }
    }

    return origRequest(config);
  };

  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData (method) {
    instance[method] = function (url, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url
      }));
    };
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData (method) {
    instance[method] = function (url, data, config) {
      return this.request(utils.merge(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  requestInterceptorWrapper(instance);
  responseInterceptorWrapper(instance);

  return instance;
}

module.exports = axiosCookieJarSupport;

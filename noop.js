'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @param {import('axios').AxiosInstance} axios
 * @returns {import('axios').AxiosInstance}
 */
function noop(axios) {
  return axios;
}

exports.wrapper = noop;

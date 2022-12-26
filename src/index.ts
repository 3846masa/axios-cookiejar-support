import type { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http';
import type { CookieJar } from 'tough-cookie';

const AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT = Symbol('AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT');

declare module 'axios' {
  interface AxiosRequestConfig {
    jar?: CookieJar;
  }
}

function requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
  if (!config.jar) {
    return config;
  }

  // @ts-expect-error ...
  if (config.jar === true) {
    throw new Error('config.jar does not accept boolean since axios-cookiejar-support@2.0.0.');
  }

  if (
    (config.httpAgent != null && config.httpAgent[AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT] !== true) ||
    (config.httpsAgent != null && config.httpsAgent[AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT] !== true)
  ) {
    throw new Error('axios-cookiejar-support does not support for use with other http(s).Agent.');
  }

  config.httpAgent = new HttpCookieAgent({ cookies: { jar: config.jar } });
  Object.defineProperty(config.httpAgent, AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });

  config.httpsAgent = new HttpsCookieAgent({ cookies: { jar: config.jar } });
  Object.defineProperty(config.httpsAgent, AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });

  return config;
}

export function wrapper<T extends AxiosStatic | AxiosInstance>(axios: T): T {
  const isWrapped = axios.interceptors.request.handlers.find(({ fulfilled }) => fulfilled === requestInterceptor);

  if (isWrapped) {
    return axios;
  }

  axios.interceptors.request.use(requestInterceptor);

  if ('create' in axios) {
    const create = axios.create;
    axios.create = (...args) => {
      const instance = create.apply(axios, args);
      instance.interceptors.request.use(requestInterceptor);
      return instance;
    };
  }

  return axios;
}

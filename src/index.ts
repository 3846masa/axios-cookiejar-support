import type { AxiosInstance, AxiosStatic, InternalAxiosRequestConfig } from 'axios';
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http';
import type { CookieJar } from 'tough-cookie';

const AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT = Symbol('AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT');

declare module 'axios' {
  interface AxiosRequestConfig {
    jar?: CookieJar;
  }
}

function requestInterceptor(options?: object) {
  return function (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
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
  
    config.httpAgent = new HttpCookieAgent({ ...options, cookies: { jar: config.jar }});
    Object.defineProperty(config.httpAgent, AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false,
    });
  
    config.httpsAgent = new HttpsCookieAgent({ ...options, cookies: { jar: config.jar }});
    Object.defineProperty(config.httpsAgent, AGENT_CREATED_BY_AXIOS_COOKIEJAR_SUPPORT, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false,
    });
  
    return config;
  }
}

export function wrapper<T extends AxiosStatic | AxiosInstance>(axios: T, opts?: object): T {
  const interceptor = requestInterceptor(opts);
  const isWrapped = axios.interceptors.request.handlers.find(({ fulfilled }) => fulfilled === interceptor);

  if (isWrapped) {
    return axios;
  }

  axios.interceptors.request.use(interceptor);

  if ('create' in axios) {
    const create = axios.create;
    axios.create = (...args) => {
      const instance = create.apply(axios, args);
      instance.interceptors.request.use(interceptor);
      return instance;
    };
  }

  return axios;
}
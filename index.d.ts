import { AxiosInstance } from 'axios';
import { CookieJar } from 'tough-cookie';

declare module 'axios' {
  export interface AxiosRequestConfig {
    jar?: CookieJar;
  }
}

declare var axiosCookieJarSupport: (instance: AxiosInstance) => AxiosInstance;
export = axiosCookieJarSupport;

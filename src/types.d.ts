import type { CookieJar } from 'tough-cookie';

declare module 'axios' {
  interface AxiosInterceptorManager<V> {
    handlers: Array<{
      fulfilled: (...args: unknown[]) => unknown;
      rejected: (...args: unknown[]) => unknown;
      synchronous: unknown;
      runWhen: unknown;
    }>;
  }
}

import 'axios';

declare module 'axios' {
  interface AxiosInterceptorManager {
    handlers: Array<{
      fulfilled: (...args: unknown[]) => unknown;
      rejected: (...args: unknown[]) => unknown;
      runWhen: unknown;
      synchronous: unknown;
    }>;
  }
}

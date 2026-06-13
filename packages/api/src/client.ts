import {
  createAuthRequestInterceptor,
  createUnauthorizedResponseInterceptor,
  type HttpMethod,
  type HttpRequest,
  normalizeResponseError,
  type RequestInterceptor,
  type ResponseInterceptor,
  type TokenGetter,
} from './interceptors';

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface RequestOptions {
  query?: QueryParams | undefined;
  headers?: Record<string, string> | undefined;
  signal?: AbortSignal | undefined;
}

export interface HttpClientConfig {
  baseUrl: string;
  getAccessToken?: TokenGetter | undefined;
  onUnauthorized?: (() => void | Promise<void>) | undefined;
  defaultHeaders?: Record<string, string> | undefined;
  fetchFn?: typeof fetch | undefined;
}

export interface HttpClient {
  request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T>;
  get<T>(path: string, options?: RequestOptions): Promise<T>;
  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T>;
  delete<T>(path: string, options?: RequestOptions): Promise<T>;
  addRequestInterceptor(interceptor: RequestInterceptor): void;
  addResponseInterceptor(interceptor: ResponseInterceptor): void;
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const base = baseUrl.replace(/\/+$/, '');
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) {
    return url;
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }
  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

function serializeBody(body: unknown, headers: Headers): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }
  if (body instanceof FormData || body instanceof Blob || typeof body === 'string') {
    return body;
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return JSON.stringify(body);
}

export function createHttpClient(config: HttpClientConfig): HttpClient {
  const requestInterceptors: RequestInterceptor[] = [];
  const responseInterceptors: ResponseInterceptor[] = [];

  if (config.getAccessToken) {
    requestInterceptors.push(createAuthRequestInterceptor(config.getAccessToken));
  }
  if (config.onUnauthorized) {
    responseInterceptors.push(createUnauthorizedResponseInterceptor(config.onUnauthorized));
  }

  // Wrapping keeps the global fetch call bound to its environment (web and RN).
  const fetchFn: typeof fetch = config.fetchFn ?? ((input, init) => fetch(input, init));

  async function request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const headers = new Headers({ ...config.defaultHeaders, ...options.headers });
    let req: HttpRequest = {
      url: buildUrl(config.baseUrl, path, options.query),
      method,
      headers,
      body: serializeBody(body, headers),
      signal: options.signal,
    };
    for (const interceptor of requestInterceptors) {
      req = await interceptor(req);
    }

    const init: RequestInit = { method: req.method, headers: req.headers };
    if (req.body !== undefined) {
      init.body = req.body;
    }
    if (req.signal !== undefined) {
      init.signal = req.signal;
    }

    let response = await fetchFn(req.url, init);
    for (const interceptor of responseInterceptors) {
      response = await interceptor(response, req);
    }

    if (!response.ok) {
      throw await normalizeResponseError(response);
    }
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
      // No content — callers declare T as void for these endpoints.
      return undefined as T;
    }
    // Boundary cast: response typing is owned by the per-domain query factories.
    return (await response.json()) as T;
  }

  return {
    request,
    get: (path, options) => request('GET', path, undefined, options),
    post: (path, body, options) => request('POST', path, body, options),
    put: (path, body, options) => request('PUT', path, body, options),
    patch: (path, body, options) => request('PATCH', path, body, options),
    delete: (path, options) => request('DELETE', path, undefined, options),
    addRequestInterceptor: (interceptor) => {
      requestInterceptors.push(interceptor);
    },
    addResponseInterceptor: (interceptor) => {
      responseInterceptors.push(interceptor);
    },
  };
}

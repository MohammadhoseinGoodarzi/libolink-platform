import type { ApiErrorBody, Nullable } from '@repo/types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequest {
  url: string;
  method: HttpMethod;
  headers: Headers;
  body?: BodyInit | undefined;
  signal?: AbortSignal | undefined;
}

export type RequestInterceptor = (request: HttpRequest) => HttpRequest | Promise<HttpRequest>;

export type ResponseInterceptor = (
  response: Response,
  request: HttpRequest,
) => Response | Promise<Response>;

export type TokenGetter = () => Nullable<string> | Promise<Nullable<string>>;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: Record<string, string[]> | undefined;

  constructor(status: number, code: string, message: string, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function createAuthRequestInterceptor(getAccessToken: TokenGetter): RequestInterceptor {
  return async (request) => {
    const token = await getAccessToken();
    if (token !== null && !request.headers.has('Authorization')) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  };
}

export function createUnauthorizedResponseInterceptor(
  onUnauthorized: () => void | Promise<void>,
): ResponseInterceptor {
  return async (response) => {
    if (response.status === 401) {
      await onUnauthorized();
    }
    return response;
  };
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return (
    typeof Reflect.get(value, 'code') === 'string' &&
    typeof Reflect.get(value, 'message') === 'string'
  );
}

function extractErrorBody(value: unknown): Nullable<ApiErrorBody> {
  if (isApiErrorBody(value)) {
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    const nested: unknown = Reflect.get(value, 'error');
    if (isApiErrorBody(nested)) {
      return nested;
    }
  }
  return null;
}

export async function normalizeResponseError(response: Response): Promise<ApiError> {
  let body: Nullable<ApiErrorBody> = null;
  try {
    body = extractErrorBody(await response.json());
  } catch {
    // Non-JSON error body — fall back to the HTTP status.
  }
  return new ApiError(
    response.status,
    body?.code ?? `http_${response.status}`,
    body?.message ?? (response.statusText || 'Request failed'),
    body?.details,
  );
}

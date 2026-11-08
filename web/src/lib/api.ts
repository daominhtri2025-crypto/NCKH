/**
 * Lớp gọi API duy nhất của ứng dụng. Mọi lỗi HTTP được chuyển thành ApiError
 * với thông điệp tiếng Việt do máy chủ trả về.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type Method = 'GET' | 'POST' | 'DELETE';

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    method,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
      // Máy chủ yêu cầu JSON cho mọi phương thức ghi (chống CSRF); gửi '{}' khi không có nội dung.
      ...(method === 'GET' ? {} : { 'Content-Type': 'application/json' }),
    },
    body: method === 'GET' ? undefined : JSON.stringify(body ?? {}),
  });

  let data: unknown = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message = (data as { error?: string }).error ?? 'Có lỗi xảy ra. Vui lòng thử lại.';
    throw new ApiError(response.status, message);
  }
  return data as T;
}

export const api = {
  get: <T,>(path: string) => request<T>('GET', path),
  post: <T,>(path: string, body?: unknown) => request<T>('POST', path, body),
  logout: () => request<{ ok: boolean }>('DELETE', '/session'),
};

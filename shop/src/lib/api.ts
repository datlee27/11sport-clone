export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"
).replace(/\/+$/, "");

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export interface ApiFetchOptions extends Omit<RequestInit, "next"> {
  params?: Record<string, string | number | boolean | undefined | null>;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

function buildUrl(
  path: string,
  params?: ApiFetchOptions["params"]
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * Client fetch dùng chung cho SSR / ISR / Client trên shop/.
 * Hỗ trợ `next: { revalidate, tags }` của Next.js 14 App Router.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { params, headers, next, ...rest } = options;
  const url = buildUrl(path, params);

  const response = await fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(next ? { next } : {}),
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const message =
      (payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string" &&
        payload.message) ||
      `Yêu cầu thất bại (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

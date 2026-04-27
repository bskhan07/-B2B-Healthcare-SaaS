import type { ApiResponse, ApiError } from "@healthcare/types";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  signal?: AbortSignal;
}

// Token management
let accessToken: string | null = null;
let refreshToken: string | null = null;
let onTokenRefresh: ((tokens: { accessToken: string; refreshToken: string }) => void) | null = null;
let onAuthError: (() => void) | null = null;

/**
 * Configure the API client
 */
export function configureApiClient(config: {
  onTokenRefresh?: (tokens: { accessToken: string; refreshToken: string }) => void;
  onAuthError?: () => void;
}) {
  if (config.onTokenRefresh) onTokenRefresh = config.onTokenRefresh;
  if (config.onAuthError) onAuthError = config.onAuthError;
}

/**
 * Set authentication tokens
 */
export function setAuthTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
}

/**
 * Clear authentication tokens
 */
export function clearAuthTokens() {
  accessToken = null;
  refreshToken = null;
}

/**
 * Get the base URL from environment
 */
function getBaseUrl(): string {
  return (
    (typeof import.meta !== "undefined" && (import.meta as unknown as Record<string, Record<string, string>>).env?.VITE_API_BASE_URL) ||
    "/api/v1"
  );
}

/**
 * Build URL with query params
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(endpoint, getBaseUrl().startsWith("http") ? getBaseUrl() : window.location.origin);
  if (!endpoint.startsWith("http")) {
    url.pathname = `${getBaseUrl()}${endpoint}`;
  }
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

/**
 * Build request headers
 */
function buildHeaders(custom?: Record<string, string>): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
    Accept: "application/json",
    ...custom,
  });

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

/**
 * Handle API response
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    // Handle 401 - attempt token refresh
    if (response.status === 401 && refreshToken) {
      const refreshed = await attemptTokenRefresh();
      if (!refreshed && onAuthError) {
        onAuthError();
      }
    }

    const error: ApiError = await response.json().catch(() => ({
      code: `HTTP_${response.status}`,
      message: response.statusText || "An error occurred",
    }));

    throw error;
  }

  return response.json() as Promise<ApiResponse<T>>;
}

/**
 * Attempt to refresh the access token
 */
async function attemptTokenRefresh(): Promise<boolean> {
  try {
    const response = await fetch(buildUrl("/auth/refresh"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      accessToken = data.data.accessToken;
      refreshToken = data.data.refreshToken;
      if (onTokenRefresh) {
        onTokenRefresh({ accessToken: data.data.accessToken, refreshToken: data.data.refreshToken });
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Core request function
 */
async function request<T>(
  method: RequestMethod,
  endpoint: string,
  body?: unknown,
  config?: RequestConfig
): Promise<ApiResponse<T>> {
  const url = buildUrl(endpoint, config?.params);
  const headers = buildHeaders(config?.headers);

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    signal: config?.signal,
  });

  return handleResponse<T>(response);
}

/**
 * API Client methods
 */
export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>("GET", endpoint, undefined, config),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>("POST", endpoint, body, config),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>("PUT", endpoint, body, config),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>("PATCH", endpoint, body, config),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>("DELETE", endpoint, undefined, config),
};

/**
 * API Endpoints registry - centralized endpoint paths
 */
export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    me: "/auth/me",
  },
  patients: {
    list: "/patients",
    detail: (id: string) => `/patients/${id}`,
    create: "/patients",
    update: (id: string) => `/patients/${id}`,
    delete: (id: string) => `/patients/${id}`,
    search: "/patients/search",
    medicalRecords: (id: string) => `/patients/${id}/records`,
  },
  appointments: {
    list: "/appointments",
    detail: (id: string) => `/appointments/${id}`,
    create: "/appointments",
    update: (id: string) => `/appointments/${id}`,
    cancel: (id: string) => `/appointments/${id}/cancel`,
    availability: "/appointments/availability",
    upcoming: "/appointments/upcoming",
  },
  billing: {
    invoices: "/billing/invoices",
    invoiceDetail: (id: string) => `/billing/invoices/${id}`,
    claims: "/billing/claims",
    claimDetail: (id: string) => `/billing/claims/${id}`,
    payments: "/billing/payments",
  },
  reports: {
    dashboard: "/reports/dashboard",
    revenue: "/reports/revenue",
    patients: "/reports/patients",
    appointments: "/reports/appointments",
    export: "/reports/export",
  },
  users: {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    roles: "/users/roles",
    permissions: "/users/permissions",
  },
  organizations: {
    current: "/organizations/current",
    settings: "/organizations/settings",
  },
  notifications: {
    list: "/notifications",
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: "/notifications/read-all",
  },
} as const;

export type { ApiResponse, ApiError } from "@healthcare/types";

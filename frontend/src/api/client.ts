const API_URL = import.meta.env.VITE_API_URL as string;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message ?? `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export { request };

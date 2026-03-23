const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      Array.isArray(payload?.message)
        ? payload.message[0]
        : payload?.message || "Erro na comunicação com o servidor",
    );
  }

  return payload?.data;
}

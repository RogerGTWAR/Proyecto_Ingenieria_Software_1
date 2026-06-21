import { showAppAlert } from "./appAlert";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function api(path, { method = "GET", body, token } = {}) {
  if (!BASE_URL) {
    throw new Error("No se ha configurado VITE_API_URL en el frontend.");
  }

  const url = `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { "Content-Type": "application/json" } : {}),
  };

  try {
    const res = await fetch(url, {
      method,
      headers,
      credentials: "include",
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();

    let json = {};

    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = {};
    }

    if (!res.ok || json.ok === false) {
      const msg =
        json.msg ||
        json.message ||
        `Ocurrió un error en la solicitud. Código: ${res.status}`;

      showAppAlert({
        type: "error",
        title: "Error del sistema",
        message: msg,
      });

      throw new Error(msg);
    }

    return json;
  } catch (error) {
    const mensaje = error.message || "";

    if (!navigator.onLine) {
      showAppAlert({
        type: "warning",
        title: "Sin conexión",
        message:
          "No tienes conexión a internet. Verifica tu red e inténtalo nuevamente.",
      });

      throw new Error("Sin conexión a internet.");
    }

    if (mensaje.includes("Failed to fetch")) {
      showAppAlert({
        type: "error",
        title: "Error de conexión",
        message:
          "No fue posible conectar con el servidor. Verifica que el backend esté encendido.",
      });

      throw new Error("No fue posible conectar con el servidor.");
    }

    throw error;
  }
}
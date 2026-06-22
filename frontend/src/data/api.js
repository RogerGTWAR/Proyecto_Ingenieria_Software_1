import { showAppAlert } from "./appAlert";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function api(
  path,
  { method = "GET", body, token, showErrorAlert = true } = {}
) {
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

      if (showErrorAlert) {
        showAppAlert({
          type: "error",
          title: "Error del sistema",
          message: msg,
        });
      }

      throw new Error(msg);
    }

    return json;
  } catch (error) {
    const mensaje = error.message || "";

    if (!navigator.onLine) {
      const msg =
        "No tienes conexión a internet. Verifica tu red e inténtalo nuevamente.";

      if (showErrorAlert) {
        showAppAlert({
          type: "warning",
          title: "Sin conexión",
          message: msg,
        });
      }

      throw new Error("Sin conexión a internet.");
    }

    if (mensaje.includes("Failed to fetch")) {
      const msg =
        "No fue posible conectar con el servidor. Verifica que el backend esté encendido.";

      if (showErrorAlert) {
        showAppAlert({
          type: "error",
          title: "Error de conexión",
          message: msg,
        });
      }

      throw new Error("No fue posible conectar con el servidor.");
    }

    throw error;
  }
}
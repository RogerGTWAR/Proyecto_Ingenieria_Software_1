export function showAppAlert({
  type = "error",
  title = "Aviso",
  message = "",
}) {
  window.dispatchEvent(
    new CustomEvent("app-alert", {
      detail: { type, title, message },
    })
  );
}
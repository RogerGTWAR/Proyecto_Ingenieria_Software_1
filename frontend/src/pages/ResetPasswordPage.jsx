import { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    usuario: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      /*
        Aquí puedes conectar tu API real.

        Ejemplo:
        await fetch("http://localhost:3000/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });
      */

      await new Promise((resolve) => setTimeout(resolve, 800));

      setSuccess(
        "Solicitud enviada. Revise las instrucciones para recuperar su contraseña."
      );

      setForm({
        usuario: "",
      });
    } catch (err) {
      setError(err.message || "No se pudo enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-200 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-2xl lg:grid-cols-[1.05fr_1fr]">
          <section className="hidden bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-3xl border border-white/10 bg-white/10 p-3 shadow-sm backdrop-blur">
                <img
                  src="/Logo.jpg"
                  alt="ACONSA"
                  className="h-14 w-14 rounded-2xl object-cover shadow-lg"
                />

                <div>
                  <p className="text-sm font-medium text-cyan-100">
                    Asesoría &
                  </p>

                  <p className="text-sm font-bold text-white">
                    Construcción S.A.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  Recuperación
                </p>

                <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white">
                  Recupera el acceso a tu cuenta
                </h1>

                <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                  Ingresa tu usuario o correo registrado para iniciar el proceso
                  de recuperación de contraseña.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <InfoBox
                title="Proceso seguro"
                text="La recuperación ayuda a proteger el acceso al sistema."
              />

              <InfoBox
                title="Cuenta vinculada"
                text="La solicitud se asocia al usuario registrado."
              />

              <InfoBox
                title="Acceso administrativo"
                text="Recupera tus credenciales para volver al panel."
              />
            </div>
          </section>

          <section className="flex items-center justify-center bg-slate-50 px-5 py-8 sm:px-8 lg:px-10">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center lg:hidden">
                <div className="mb-5 flex justify-center">
                  <img
                    src="/Logo.jpg"
                    alt="ACONSA"
                    className="h-24 w-24 rounded-3xl object-cover shadow-lg"
                  />
                </div>

                <p className="text-sm font-medium text-blue-700">
                  Sistema ACSA
                </p>

                <h1 className="mt-1 text-2xl font-black text-slate-900">
                  Recuperar contraseña
                </h1>
              </div>

              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-blue-700">
                  Recuperación de acceso
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                  Restablecer contraseña
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Escriba su usuario o correo para solicitar la recuperación.
                </p>
              </div>

              {success && (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
                  {success}
                </div>
              )}

              {error && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
                  {error}
                </div>
              )}

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Usuario o correo
                  </label>

                  <input
                    type="text"
                    name="usuario"
                    value={form.usuario}
                    onChange={(e) =>
                      setForm({ ...form, usuario: e.target.value })
                    }
                    placeholder="Ingrese su usuario o correo"
                    required
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-300
                      bg-slate-100
                      px-4
                      py-3
                      text-sm
                      text-slate-800
                      shadow-sm
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-700
                      focus:bg-white
                      focus:ring-4
                      focus:ring-blue-100
                    "
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-r
                    from-blue-800
                    to-cyan-700
                    px-5
                    py-3.5
                    text-sm
                    font-bold
                    text-white
                    shadow-lg
                    transition
                    hover:scale-[1.01]
                    hover:shadow-xl
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                    disabled:hover:scale-100
                  "
                >
                  {loading ? "Enviando solicitud..." : "Enviar solicitud"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                <p className="text-sm text-slate-600">
                  ¿Recordaste tu contraseña?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-blue-800 transition hover:text-cyan-700 hover:underline"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <Link
                  to="/signup"
                  className="text-sm font-bold text-slate-600 transition hover:text-blue-800 hover:underline"
                >
                  Crear una cuenta nueva
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur">
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="mt-1 text-sm leading-5 text-cyan-100">{text}</p>
    </div>
  );
}
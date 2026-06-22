import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ResetPasswordPage() {
  const { sendForgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    usuario: "",
    codigo: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const cambiarCampo = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const solicitarCodigo = async (e) => {
    e.preventDefault();

    if (!form.usuario.trim()) {
      setError("Debe ingresar su usuario o correo.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await sendForgotPassword(form.usuario.trim());

      setSuccess(
        "Código enviado. Revise el correo registrado del empleado vinculado a este usuario."
      );

      setStep(2);
    } catch (err) {
      setError(err.message || "No se pudo enviar el código de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  const cambiarContrasena = async (e) => {
    e.preventDefault();

    if (!form.usuario.trim()) {
      setError("Debe ingresar su usuario o correo.");
      return;
    }

    if (!form.codigo.trim()) {
      setError("Debe ingresar el código de verificación.");
      return;
    }

    if (!form.contrasena.trim()) {
      setError("Debe ingresar la nueva contraseña.");
      return;
    }

    if (form.contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (form.contrasena !== form.confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await resetPassword(
        form.usuario.trim(),
        form.codigo.trim(),
        form.contrasena
      );

      setSuccess(
        "Contraseña actualizada correctamente. Redirigiendo al inicio de sesión..."
      );

      setForm({
        usuario: "",
        codigo: "",
        contrasena: "",
        confirmarContrasena: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "No se pudo actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const volverPasoUno = () => {
    setStep(1);
    setError("");
    setSuccess("");

    setForm((prev) => ({
      ...prev,
      codigo: "",
      contrasena: "",
      confirmarContrasena: "",
    }));
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
                  Ingresa tu usuario o correo, recibe un código de verificación
                  y cambia tu contraseña de forma sencilla.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <InfoBox
                title="Paso 1"
                text="Solicita un código usando tu usuario o correo registrado."
              />

              <InfoBox
                title="Paso 2"
                text="Revisa el correo del empleado vinculado a tu cuenta."
              />

              <InfoBox
                title="Paso 3"
                text="Escribe el código recibido y crea una nueva contraseña."
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
                  Sistema ACONSA
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
                  {step === 1 ? "Solicitar código" : "Nueva contraseña"}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {step === 1
                    ? "Escriba su usuario o correo para recibir un código."
                    : "Ingrese el código recibido y defina su nueva contraseña."}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <StepBox active={step === 1} number="1" text="Enviar código" />
                <StepBox active={step === 2} number="2" text="Cambiar clave" />
              </div>

              {success && (
                <MessageBox
                  tipo="success"
                  titulo="Proceso correcto"
                  texto={success}
                  onClose={() => setSuccess("")}
                />
              )}

              {error && (
                <MessageBox
                  tipo="error"
                  titulo="Ocurrió un problema"
                  texto={error}
                  onClose={() => setError("")}
                />
              )}

              {step === 1 ? (
                <form onSubmit={solicitarCodigo} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Usuario o correo
                    </label>

                    <input
                      type="text"
                      name="usuario"
                      value={form.usuario}
                      onChange={cambiarCampo}
                      placeholder="Ingrese su usuario o correo"
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
                    {loading ? "Enviando código..." : "Enviar código"}
                  </button>
                </form>
              ) : (
                <form onSubmit={cambiarContrasena} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Usuario o correo
                    </label>

                    <input
                      type="text"
                      name="usuario"
                      value={form.usuario}
                      onChange={cambiarCampo}
                      placeholder="Ingrese su usuario o correo"
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

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Código de verificación
                    </label>

                    <input
                      type="text"
                      name="codigo"
                      value={form.codigo}
                      onChange={cambiarCampo}
                      placeholder="Ejemplo: 123456"
                      maxLength={6}
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

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Nueva contraseña
                    </label>

                    <input
                      type="password"
                      name="contrasena"
                      value={form.contrasena}
                      onChange={cambiarCampo}
                      placeholder="Ingrese la nueva contraseña"
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

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">
                      Confirmar contraseña
                    </label>

                    <input
                      type="password"
                      name="confirmarContrasena"
                      value={form.confirmarContrasena}
                      onChange={cambiarCampo}
                      placeholder="Repita la nueva contraseña"
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
                    {loading ? "Actualizando..." : "Cambiar contraseña"}
                  </button>

                  <button
                    type="button"
                    onClick={volverPasoUno}
                    disabled={loading}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-slate-300
                      bg-white
                      px-5
                      py-3
                      text-sm
                      font-bold
                      text-slate-700
                      shadow-sm
                      transition
                      hover:bg-slate-100
                      disabled:cursor-not-allowed
                      disabled:opacity-70
                    "
                  >
                    Solicitar otro código
                  </button>
                </form>
              )}

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

function StepBox({ active, number, text }) {
  return (
    <div
      className={`
        rounded-2xl
        border
        px-4
        py-3
        text-center
        shadow-sm
        ${
          active
            ? "border-blue-200 bg-blue-100 text-blue-900"
            : "border-slate-200 bg-white text-slate-600"
        }
      `}
    >
      <p
        className={`
          mx-auto
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-xl
          text-sm
          font-black
          ${
            active
              ? "bg-blue-700 text-white"
              : "bg-slate-200 text-slate-700"
          }
        `}
      >
        {number}
      </p>

      <p className="mt-2 text-sm font-bold">{text}</p>
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

function MessageBox({ tipo, titulo, texto, onClose }) {
  const isError = tipo === "error";

  return (
    <div
      className={`
        mt-6
        flex
        items-start
        gap-3
        rounded-2xl
        border
        px-4
        py-3
        shadow-sm
        ${
          isError
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }
      `}
    >
      <div
        className={`
          mt-0.5
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-xl
          text-sm
          font-black
          ${isError ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}
        `}
      >
        {isError ? "!" : "✓"}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-black">{titulo}</p>
        <p className="mt-1 text-sm leading-5">{texto}</p>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-xl
          text-sm
          font-black
          transition
          hover:bg-black/5
        "
        aria-label="Cerrar mensaje"
      >
        ×
      </button>
    </div>
  );
}
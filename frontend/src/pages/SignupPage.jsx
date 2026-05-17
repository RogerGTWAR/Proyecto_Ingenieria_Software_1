import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const validarContrasena = (contrasena) => {
  return {
    longitud: contrasena.length >= 8,
    mayuscula: /[A-Z]/.test(contrasena),
    minuscula: /[a-z]/.test(contrasena),
    numero: /[0-9]/.test(contrasena),
    simbolo: /[^A-Za-z0-9]/.test(contrasena),
  };
};

const contrasenaValida = (contrasena) => {
  const reglas = validarContrasena(contrasena);
  return Object.values(reglas).every(Boolean);
};

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cedula: "",
    usuario: "",
    contrasena: "",
  });

  const [loading, setLoading] = useState(false);

  const [mensaje, setMensaje] = useState({
    tipo: "",
    texto: "",
  });

  const reglasPassword = validarContrasena(form.contrasena);
  const passwordEsValida = contrasenaValida(form.contrasena);

  const limpiarMensaje = () => {
    setMensaje({
      tipo: "",
      texto: "",
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    limpiarMensaje();

    if (!passwordEsValida) {
      setMensaje({
        tipo: "error",
        texto:
          "La contraseña no cumple con los requisitos mínimos de seguridad.",
      });
      return;
    }

    try {
      setLoading(true);

      await register({
        cedula: form.cedula.trim(),
        usuario: form.usuario.trim(),
        contrasena: form.contrasena,
      });

      setMensaje({
        tipo: "success",
        texto:
          "Cuenta creada correctamente. Será redirigido al inicio de sesión.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1400);
    } catch (err) {
      setMensaje({
        tipo: "error",
        texto:
          err.message ||
          "No se pudo crear la cuenta. Revise los datos e intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-slate-200 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-300 bg-white shadow-2xl lg:grid-cols-[1fr_1.05fr]">
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
                  Sistema ACSA
                </p>

                <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white">
                  Crea tu cuenta de acceso
                </h1>

                <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                  Registra un usuario usando la cédula del empleado para
                  vincular la cuenta al personal registrado.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <InfoBox
                title="Acceso seguro"
                text="Usuario y contraseña para iniciar sesión."
              />

              <InfoBox
                title="Vinculación por cédula"
                text="La cédula identifica al empleado registrado."
              />

              <InfoBox
                title="Contraseña segura"
                text="Debe incluir mayúscula, minúscula, número y símbolo."
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
                  Crear cuenta
                </h1>
              </div>

              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-blue-700">
                  Registro de usuario
                </p>

                <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-900">
                  Crear cuenta
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  Complete los datos para crear una cuenta de acceso.
                </p>
              </div>

              {mensaje.texto && (
                <MessageBox tipo={mensaje.tipo} texto={mensaje.texto} />
              )}

              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <FormField
                  label="Cédula del empleado"
                  type="text"
                  name="cedula"
                  value={form.cedula}
                  placeholder="Ingrese la cédula del empleado"
                  onChange={(e) =>
                    setForm({ ...form, cedula: e.target.value })
                  }
                />

                <FormField
                  label="Usuario"
                  type="text"
                  name="usuario"
                  value={form.usuario}
                  placeholder="Ingrese un nombre de usuario"
                  onChange={(e) =>
                    setForm({ ...form, usuario: e.target.value })
                  }
                />

                <div>
                  <FormField
                    label="Contraseña"
                    type="password"
                    name="contrasena"
                    value={form.contrasena}
                    placeholder="Ingrese una contraseña segura"
                    onChange={(e) =>
                      setForm({ ...form, contrasena: e.target.value })
                    }
                  />

                  <PasswordRules reglas={reglasPassword} />
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
                  {loading ? "Registrando cuenta..." : "Registrar cuenta"}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                <p className="text-sm text-slate-600">
                  ¿Ya tiene cuenta?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-blue-800 transition hover:text-cyan-700 hover:underline"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, type, name, value, placeholder, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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
  );
}

function PasswordRules({ reglas }) {
  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
      <p className="mb-2 text-center text-xs font-bold text-slate-600">
        Requisitos de contraseña
      </p>

      <div className="mx-auto grid max-w-[330px] grid-cols-3 gap-1.5">
        <RuleItem valido={reglas.longitud} texto="8 caracteres" />
        <RuleItem valido={reglas.mayuscula} texto="Mayúscula" />
        <RuleItem valido={reglas.minuscula} texto="Minúscula" />
      </div>

      <div className="mx-auto mt-1.5 grid max-w-[220px] grid-cols-2 gap-1.5">
        <RuleItem valido={reglas.numero} texto="Número" />
        <RuleItem valido={reglas.simbolo} texto="Símbolo" />
      </div>
    </div>
  );
}

function RuleItem({ valido, texto }) {
  return (
    <span
      className={`
        inline-flex
        min-w-0
        items-center
        justify-center
        gap-1
        rounded-full
        border
        px-2
        py-1
        text-center
        text-[11px]
        font-semibold
        transition
        ${
          valido
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-slate-200 bg-white text-slate-500"
        }
      `}
    >
      <span
        className={`
          flex
          h-3.5
          w-3.5
          shrink-0
          items-center
          justify-center
          rounded-full
          text-[9px]
          font-black
          ${
            valido
              ? "bg-emerald-600 text-white"
              : "bg-slate-300 text-slate-600"
          }
        `}
      >
        {valido ? "✓" : "•"}
      </span>

      <span className="truncate">{texto}</span>
    </span>
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

function MessageBox({ tipo, texto }) {
  const isSuccess = tipo === "success";

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
          isSuccess
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-red-200 bg-red-50 text-red-800"
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
          ${
            isSuccess
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }
        `}
      >
        {isSuccess ? "✓" : "!"}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-black">
          {isSuccess ? "Registro exitoso" : "No se pudo registrar"}
        </p>

        <p className="mt-1 text-sm leading-5">{texto}</p>
      </div>
    </div>
  );
}
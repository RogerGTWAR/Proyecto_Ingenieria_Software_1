import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    usuario: "",
    contrasena: "",
  });

  const [showPw, setShowPw] = useState(false);

  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas.");
      setTimeout(() => setError(""), 4000); 
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF1F7] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden animate-fadeIn">

        <div className="md:w-1/2 bg-[#1A2E81] p-10 flex flex-col items-center text-white relative">

          <img
            src="/Logo.jpg"
            alt="ACONSA"
            className="h-24 w-auto mb-6 drop-shadow-xl"
          />

          <h1 className="text-3xl font-extrabold text-center mb-6">
            Bienvenido a ACONSA
          </h1>

          <p className="text-center opacity-90 text-base leading-relaxed mb-8 px-4">
            Plataforma de gestión para proyectos, maquinaria, personal,
            inventario, compras y reportes estratégicos.
          </p>
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-center bg-white">

          <h2 className="text-3xl font-bold text-center text-[#1A2E81] mb-8">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-sm animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Usuario
              </label>
              <input
                type="text"
                name="usuario"
                value={form.usuario}
                onChange={(e) =>
                  setForm({ ...form, usuario: e.target.value })
                }
                placeholder="Ingrese su usuario"
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Contraseña
              </label>

              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  name="contrasena"
                  value={form.contrasena}
                  onChange={(e) =>
                    setForm({ ...form, contrasena: e.target.value })
                  }
                  placeholder="Ingrese su contraseña"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
                >
                  {showPw ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <p className="text-right mt-2">
                <Link
                  to="/reset-password"
                  className="text-[#1A2E81] font-semibold hover:underline text-sm"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-[#1A2E81] text-white font-semibold shadow-md hover:bg-[#16256A] transition"
            >
              Entrar
            </button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            ¿No tiene cuenta?{" "}
            <Link
              to="/signup"
              className="text-[#1A2E81] font-semibold hover:underline"
            >
              Crear una cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

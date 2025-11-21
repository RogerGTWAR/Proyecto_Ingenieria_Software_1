import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    empleado_id: "",
    usuario: "",
    contrasena: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Cuenta creada con éxito. Ahora inicie sesión.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF1F7] flex items-center justify-center px-4 py-10">

      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-lg p-10 animate-fadeIn">

        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="/Logo.jpg"
            alt="ACONSA"
            className="h-24 w-auto drop-shadow-lg"
          />
        </div>

        {/* TÍTULO */}
        <h1 className="text-3xl font-bold text-center text-[#1A2E81] mb-8">
          Crear Cuenta
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">

          {/* EMPLEADO ID */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              ID del Empleado
            </label>
            <input
              type="number"
              name="empleado_id"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
              value={form.empleado_id}
              onChange={(e) =>
                setForm({ ...form, empleado_id: e.target.value })
              }
              placeholder="Ingrese el ID del empleado"
              required
            />
          </div>

          {/* USUARIO */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Usuario
            </label>
            <input
              type="text"
              name="usuario"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
              value={form.usuario}
              onChange={(e) =>
                setForm({ ...form, usuario: e.target.value })
              }
              placeholder="Ingrese un nombre de usuario"
              required
            />
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="contrasena"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
              value={form.contrasena}
              onChange={(e) =>
                setForm({ ...form, contrasena: e.target.value })
              }
              placeholder="Ingrese una contraseña"
              required
            />
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#1A2E81] text-white font-semibold shadow-md hover:bg-[#16256A] transition"
          >
            Registrar
          </button>
        </form>

        {/* LINK A LOGIN */}
        <p className="text-center mt-6 text-gray-600">
          ¿Ya tiene cuenta?{" "}
          <Link
            to="/login"
            className="text-[#1A2E81] font-semibold hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

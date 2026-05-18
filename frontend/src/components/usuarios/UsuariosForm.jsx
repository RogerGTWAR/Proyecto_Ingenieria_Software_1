import { useEffect, useState, useMemo } from "react";
import { useEmpleados } from "../../hooks/useEmpleados";

const UsuariosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: empleados } = useEmpleados();

  const [errors, setErrors] = useState({});
  const [busquedaEmp, setBusquedaEmp] = useState("");

  const [form, setForm] = useState({
    empleado_id: "",
    usuario: "",
    contrasena: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        empleado_id: initialData.empleado_id,
        usuario: initialData.usuario || "",
        contrasena: "",
      });
    }
  }, [initialData]);

  const empleadosFiltrados = useMemo(() => {
    const t = busquedaEmp.toLowerCase();

    if (!t.trim() || form.empleado_id) return [];

    return empleados.filter((e) =>
      `${e.nombres} ${e.apellidos}`.toLowerCase().includes(t)
    );
  }, [busquedaEmp, empleados, form.empleado_id]);

  const empleadoAsignado = useMemo(() => {
    return empleados.find((e) => Number(e.id) === Number(form.empleado_id));
  }, [form.empleado_id, empleados]);

  const passwordRules = {
    length: form.contrasena.length >= 8,
    upper: /[A-Z]/.test(form.contrasena),
    lower: /[a-z]/.test(form.contrasena),
    number: /[0-9]/.test(form.contrasena),
    symbol: /[^A-Za-z0-9]/.test(form.contrasena),
  };

  const passwordIsValid = Object.values(passwordRules).every(Boolean);

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
  const errorClass = "mt-1 text-sm font-medium text-red-600";

  const handleAsignarEmpleado = (id) => {
    setForm((prev) => ({ ...prev, empleado_id: id }));
    setErrors((prev) => ({ ...prev, empleado_id: "" }));
    setBusquedaEmp("");
  };

  const handleQuitarEmpleado = () => {
    setForm((prev) => ({ ...prev, empleado_id: "" }));
    setBusquedaEmp("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const err = {};

    if (!form.empleado_id) {
      err.empleado_id = "Debe seleccionar un empleado.";
    }

    if (!form.usuario.trim()) {
      err.usuario = "El nombre de usuario es obligatorio.";
    }

    if (!isEdit && !form.contrasena.trim()) {
      err.contrasena = "Debe ingresar una contraseña.";
    }

    if (form.contrasena.trim() && !passwordIsValid) {
      err.contrasena =
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    await onSubmit(form);
  };

  return (
    <div
      className="
        fixed left-0 right-0 bottom-0 top-16 z-40
        flex items-center justify-center overflow-y-auto
        bg-slate-900/35 px-4 py-6 lg:left-48
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          flex w-full max-w-4xl max-h-[calc(100dvh-96px)]
          flex-col overflow-hidden rounded-3xl
          border border-slate-300 bg-slate-100 shadow-2xl
        "
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white shadow-lg sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">
                Gestión de usuarios
              </p>

              <h2 className="mt-1 truncate text-sm font-bold tracking-tight text-white">
                {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
            </div>

            <SummaryBox
              label="Empleado"
              value={empleadoAsignado ? "Seleccionado" : "Sin asignar"}
            />
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información de acceso
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Seleccione el empleado y defina las credenciales del usuario.
              </p>
            </div>

            <div className="space-y-5">
              <div className="min-w-0">
                <label className={labelClass}>Empleado</label>

                {!form.empleado_id && (
                  <input
                    type="text"
                    placeholder="Buscar empleado por nombre..."
                    value={busquedaEmp}
                    onChange={(e) => setBusquedaEmp(e.target.value)}
                    className={inputClass}
                  />
                )}

                {busquedaEmp && empleadosFiltrados.length > 0 && (
                  <div className="mt-3 max-h-44 overflow-y-auto rounded-2xl border border-slate-300 bg-slate-100 shadow-md">
                    {empleadosFiltrados.map((e) => (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => handleAsignarEmpleado(e.id)}
                        className="block w-full px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-blue-100"
                      >
                        {e.nombres} {e.apellidos} — {e.rolNombre}
                      </button>
                    ))}
                  </div>
                )}

                {empleadoAsignado && (
                  <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-100 p-4 text-blue-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold">
                        {empleadoAsignado.nombres} {empleadoAsignado.apellidos}
                      </p>

                      <p className="mt-1 text-sm font-medium text-blue-700">
                        Rol: {empleadoAsignado.rolNombre || "Sin rol"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleQuitarEmpleado}
                      className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 sm:w-auto"
                    >
                      Cambiar
                    </button>
                  </div>
                )}

                {errors.empleado_id && (
                  <p className={errorClass}>{errors.empleado_id}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="min-w-0">
                  <label className={labelClass}>Usuario</label>

                  <input
                    type="text"
                    name="usuario"
                    value={form.usuario}
                    onChange={handleChange}
                    placeholder="Ejemplo: jperez"
                    className={inputClass}
                  />

                  {errors.usuario && (
                    <p className={errorClass}>{errors.usuario}</p>
                  )}
                </div>

                <div className="min-w-0">
                  <label className={labelClass}>Contraseña</label>

                  <input
                    type="password"
                    name="contrasena"
                    value={form.contrasena}
                    placeholder={isEdit ? "Opcional..." : "Ingrese una contraseña"}
                    onChange={handleChange}
                    className={inputClass}
                  />

                  {errors.contrasena && (
                    <p className={errorClass}>{errors.contrasena}</p>
                  )}
                </div>
              </div>

              <PasswordRules rules={passwordRules} password={form.contrasena} />
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-300 bg-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-8 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl sm:w-auto"
            >
              {isEdit ? "Actualizar Usuario" : "Guardar Usuario"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const PasswordRules = ({ rules, password }) => {
  if (!password) {
    return (
      <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4">
        <p className="text-sm font-bold text-slate-800">
          Requisitos de contraseña
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Rule active={false} text="Mínimo 8 caracteres" />
          <Rule active={false} text="Una letra mayúscula" />
          <Rule active={false} text="Una letra minúscula" />
          <Rule active={false} text="Un número" />
          <Rule active={false} text="Un símbolo" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4">
      <p className="text-sm font-bold text-slate-800">
        Requisitos de contraseña
      </p>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Rule active={rules.length} text="Mínimo 8 caracteres" />
        <Rule active={rules.upper} text="Una letra mayúscula" />
        <Rule active={rules.lower} text="Una letra minúscula" />
        <Rule active={rules.number} text="Un número" />
        <Rule active={rules.symbol} text="Un símbolo" />
      </div>
    </div>
  );
};

const Rule = ({ active, text }) => (
  <div
    className={`
      rounded-xl border px-3 py-2 text-sm font-bold
      ${
        active
          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
          : "border-slate-300 bg-slate-200 text-slate-600"
      }
    `}
  >
    {active ? "✓" : "•"} {text}
  </div>
);

const SummaryBox = ({ label, value }) => (
  <div className="w-full rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:w-auto sm:text-right">
    <p className="text-sm font-medium text-cyan-100">{label}</p>
    <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
  </div>
);

export default UsuariosForm;
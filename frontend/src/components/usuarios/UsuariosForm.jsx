import { useEffect, useMemo, useState } from "react";
import { useEmpleados } from "../../hooks/useEmpleados";

const UsuariosForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: empleados, reload: reloadEmpleados } = useEmpleados();

  const [errors, setErrors] = useState({});
  const [busquedaEmp, setBusquedaEmp] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    empleado_id: "",
    usuario: "",
    contrasena: "",
  });

  useEffect(() => {
    reloadEmpleados();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        empleado_id: initialData.empleado_id ?? "",
        usuario: initialData.usuario ?? "",
        contrasena: "",
      });
    } else {
      setForm({
        empleado_id: "",
        usuario: "",
        contrasena: "",
      });
    }

    setErrors({});
    setBusquedaEmp("");
  }, [initialData]);

  const empleadosFiltrados = useMemo(() => {
    const texto = busquedaEmp.trim().toLowerCase();

    if (!texto || form.empleado_id) return [];

    return (empleados || []).filter((empleado) => {
      const nombreCompleto = `${empleado.nombres ?? ""} ${
        empleado.apellidos ?? ""
      }`.toLowerCase();

      const cedula = empleado.cedula?.toLowerCase() ?? "";
      const rol = empleado.rolNombre?.toLowerCase() ?? "";

      return (
        nombreCompleto.includes(texto) ||
        cedula.includes(texto) ||
        rol.includes(texto)
      );
    });
  }, [busquedaEmp, empleados, form.empleado_id]);

  const empleadoAsignado = useMemo(() => {
    return (empleados || []).find(
      (empleado) => Number(empleado.id) === Number(form.empleado_id)
    );
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

  const handleAsignarEmpleado = (empleado) => {
    setForm((prev) => ({
      ...prev,
      empleado_id: empleado.id,
    }));

    setErrors((prev) => ({
      ...prev,
      empleado_id: "",
      general: "",
    }));

    setBusquedaEmp("");
  };

  const handleQuitarEmpleado = () => {
    setForm((prev) => ({
      ...prev,
      empleado_id: "",
    }));

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
      general: "",
    }));
  };

  const validate = () => {
    const err = {};

    if (!form.empleado_id) {
      err.empleado_id = "Debe seleccionar un empleado.";
    }

    if (!form.usuario.trim()) {
      err.usuario = "El nombre de usuario es obligatorio.";
    } else if (form.usuario.trim().length < 3) {
      err.usuario = "El usuario debe tener al menos 3 caracteres.";
    }

    if (!isEdit && !form.contrasena.trim()) {
      err.contrasena = "Debe ingresar una contraseña.";
    }

    if (form.contrasena.trim() && !passwordIsValid) {
      err.contrasena =
        "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.";
    }

    if (!isEdit && !empleadoAsignado?.cedula) {
      err.empleado_id =
        "El empleado seleccionado no tiene cédula registrada. No se puede crear el usuario.";
    }

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guardando) return;

    const err = validate();

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    try {
      setGuardando(true);

      await onSubmit({
        empleado_id: form.empleado_id,
        cedula: empleadoAsignado?.cedula ?? "",
        usuario: form.usuario.trim(),
        contrasena: form.contrasena,
      });
    } catch (error) {
      setErrors({
        general: error.message || "No se pudo guardar el usuario.",
      });
    } finally {
      setGuardando(false);
    }
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

              <p className="mt-2 text-sm text-slate-300">
                {isEdit
                  ? "Actualice el empleado vinculado, usuario o contraseña."
                  : "Seleccione un empleado registrado y cree sus credenciales de acceso."}
              </p>
            </div>

            <SummaryBox
              label="Empleado"
              value={empleadoAsignado ? "Seleccionado" : "Sin asignar"}
            />
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          {errors.general && (
            <div className="rounded-2xl border border-red-200 bg-red-100 px-4 py-3 text-sm font-bold text-red-700">
              {errors.general}
            </div>
          )}

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Empleado vinculado
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Busque y seleccione el empleado que tendrá acceso al sistema.
              </p>
            </div>

            <div className="min-w-0">
              <label className={labelClass}>Empleado</label>

              {!form.empleado_id && (
                <input
                  type="text"
                  placeholder="Buscar por nombre, cédula o rol..."
                  value={busquedaEmp}
                  onChange={(e) => setBusquedaEmp(e.target.value)}
                  className={inputClass}
                />
              )}

              {busquedaEmp && empleadosFiltrados.length > 0 && (
                <div className="mt-3 max-h-52 overflow-y-auto rounded-2xl border border-slate-300 bg-slate-100 shadow-md">
                  {empleadosFiltrados.map((empleado) => (
                    <button
                      key={empleado.id}
                      type="button"
                      onClick={() => handleAsignarEmpleado(empleado)}
                      className="block w-full border-b border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition last:border-b-0 hover:bg-blue-100"
                    >
                      <span className="block font-bold text-slate-900">
                        {empleado.nombres} {empleado.apellidos}
                      </span>

                      <span className="mt-1 block text-sm text-slate-600">
                        Cédula: {empleado.cedula || "No registrada"} | Rol:{" "}
                        {empleado.rolNombre || "Sin rol"}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {busquedaEmp &&
                empleadosFiltrados.length === 0 &&
                !form.empleado_id && (
                  <div className="mt-3 rounded-2xl border border-slate-300 bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
                    No se encontraron empleados con esa búsqueda.
                  </div>
                )}

              {empleadoAsignado && (
                <div className="mt-3 flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-100 p-4 text-blue-900 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold">
                      {empleadoAsignado.nombres} {empleadoAsignado.apellidos}
                    </p>

                    <p className="mt-1 text-sm font-medium text-blue-700">
                      Cédula: {empleadoAsignado.cedula || "No registrada"}
                    </p>

                    <p className="mt-1 text-sm font-medium text-blue-700">
                      Rol: {empleadoAsignado.rolNombre || "Sin rol"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleQuitarEmpleado}
                    disabled={guardando}
                    className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    Cambiar
                  </button>
                </div>
              )}

              {errors.empleado_id && (
                <p className={errorClass}>{errors.empleado_id}</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Credenciales de acceso
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Defina el nombre de usuario y la contraseña de acceso.
              </p>
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
                  placeholder={
                    isEdit
                      ? "Opcional: escribir solo si desea cambiarla"
                      : "Ingrese una contraseña"
                  }
                  onChange={handleChange}
                  className={inputClass}
                />

                {errors.contrasena && (
                  <p className={errorClass}>{errors.contrasena}</p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <PasswordRules rules={passwordRules} password={form.contrasena} />
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-slate-300 bg-slate-100 px-4 py-4 sm:px-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={guardando}
              className="w-full rounded-2xl border border-slate-400 bg-slate-100 px-8 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700 px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 sm:w-auto"
            >
              {guardando
                ? "Guardando..."
                : isEdit
                ? "Actualizar Usuario"
                : "Guardar Usuario"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const PasswordRules = ({ rules, password }) => {
  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-100 p-4">
      <p className="text-sm font-bold text-slate-800">
        Requisitos de contraseña
      </p>

      <p className="mt-1 text-sm text-slate-600">
        {password
          ? "La contraseña debe cumplir todos los requisitos."
          : "En edición puede dejarla vacía si no desea cambiarla."}
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
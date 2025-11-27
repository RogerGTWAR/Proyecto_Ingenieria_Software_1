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

  const handleAsignarEmpleado = (id) => {
    setForm((prev) => ({ ...prev, empleado_id: id }));
    setErrors((prev) => ({ ...prev, empleado_id: "" }));
    setBusquedaEmp("");
  };

  const handleQuitarEmpleado = () => {
    setForm((prev) => ({ ...prev, empleado_id: "" }));
    setBusquedaEmp("");
  };

  const validate = () => {
    const err = {};

    if (!form.empleado_id)
      err.empleado_id = "Debe seleccionar un empleado.";

    if (!form.usuario.trim())
      err.usuario = "El nombre de usuario es obligatorio.";

    if (!isEdit && !form.contrasena.trim())
      err.contrasena = "Debe ingresar una contraseña.";

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
    <div className="fixed inset-0 flex justify-center items-start mt-[120px] z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#F9FAFB] rounded-2xl shadow-2xl w-full max-w-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          {isEdit ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Empleado</label>

          {!form.empleado_id && (
            <input
              type="text"
              placeholder="Buscar empleado por nombre..."
              value={busquedaEmp}
              onChange={(e) => setBusquedaEmp(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          )}

          {busquedaEmp && empleadosFiltrados.length > 0 && (
            <div className="border border-gray-300 rounded mt-2 bg-white max-h-40 overflow-y-auto shadow">
              {empleadosFiltrados.map((e) => (
                <div
                  key={e.id}
                  onClick={() => handleAsignarEmpleado(e.id)}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {e.nombres} {e.apellidos} — {e.rolNombre}
                </div>
              ))}
            </div>
          )}

          {empleadoAsignado && (
            <div className="mt-3 bg-gray-100 p-3 rounded flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {empleadoAsignado.nombres} {empleadoAsignado.apellidos}
                </p>
                <p className="text-sm text-gray-600">
                  Rol: {empleadoAsignado.rolNombre}
                </p>
              </div>

              <button
                type="button"
                onClick={handleQuitarEmpleado}
                className="text-red-600 text-sm hover:underline"
              >
                Cambiar
              </button>
            </div>
          )}

          {errors.empleado_id && (
            <p className="text-red-600 text-sm">{errors.empleado_id}</p>
          )}
        </div>

        <div className="mb-5">
          <label className="block mb-1 font-medium">Usuario</label>
          <input
            type="text"
            value={form.usuario}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, usuario: e.target.value }))
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        {errors.usuario && (
          <p className="text-red-600 text-sm mb-3">{errors.usuario}</p>
        )}

        <div className="mb-5">
          <label className="block mb-1 font-medium">Contraseña</label>
          <input
            type="password"
            value={form.contrasena}
            placeholder={isEdit ? "Opcional..." : ""}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, contrasena: e.target.value }))
            }
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.contrasena && (
            <p className="text-red-600 text-sm">{errors.contrasena}</p>
          )}
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="text-white px-7 py-3 rounded"
            style={{ backgroundColor: "#1A2E81" }}
          >
            {isEdit ? "Actualizar" : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 px-7 py-3 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuariosForm;

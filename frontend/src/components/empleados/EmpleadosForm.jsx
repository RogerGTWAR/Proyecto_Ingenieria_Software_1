import { useEffect, useState } from "react";

const EmpleadosForm = ({
  onSubmit,
  onClose,
  initialData = {},
  isEdit = false,
  roles = [],
}) => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    correo: "",
    telefono: "",
    pais: "",
    direccion: "",
    fecha_nacimiento: "",
    fecha_contratacion: "",
    estado: "Activo",
    rolId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombres: initialData.nombres || "",
        apellidos: initialData.apellidos || "",
        cedula: initialData.cedula || "",
        correo: initialData.correo || "",
        telefono: initialData.telefono || "",
        pais: initialData.pais || "",
        direccion: initialData.direccion || "",
        fecha_nacimiento: initialData.fecha_nacimiento
          ? initialData.fecha_nacimiento.split("T")[0]
          : "",
        fecha_contratacion: initialData.fecha_contratacion
          ? initialData.fecha_contratacion.split("T")[0]
          : "",
        estado: initialData.estado || "Activo",
        rolId: initialData.rolId || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    const cedulaRegex = /^[0-9]{13}[A-Za-z]$/;
    if (!cedulaRegex.test(formData.cedula)) {
      newErrors.cedula =
        "La cédula debe tener el formato 2410102061000L (13 dígitos más una letra).";
    }

    if (!formData.telefono || formData.telefono.trim().length < 8) {
      newErrors.telefono = "El teléfono debe tener al menos 8 dígitos.";
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Ingrese un correo válido. Debe incluir @.";
    }

    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = "Debe ingresar la fecha de nacimiento.";
    } else {
      const nacimiento = new Date(formData.fecha_nacimiento);
      if (
        nacimiento < new Date("1970-01-01") ||
        nacimiento > new Date("2020-12-31")
      ) {
        newErrors.fecha_nacimiento =
          "La fecha de nacimiento debe estar entre 1970 y 2020.";
      }
    }

    if (!formData.fecha_contratacion) {
      newErrors.fecha_contratacion = "Debe ingresar la fecha de contratación.";
    } else {
      const contratacion = new Date(formData.fecha_contratacion);
      if (
        contratacion < new Date("2000-01-01") ||
        contratacion > new Date("2030-12-31")
      ) {
        newErrors.fecha_contratacion =
          "La fecha de contratación debe estar entre 2000 y 2030.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
  const errorClass = "mt-1 text-sm font-medium text-red-600";

  return (
    <div
      className="
        fixed
        left-0
        right-0
        bottom-0
        top-16
        z-40
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-slate-900/35
        px-4
        py-6
        lg:left-48
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          flex
          w-full
          max-w-5xl
          max-h-[calc(100dvh-96px)]
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-slate-300
          bg-slate-100
          shadow-2xl
        "
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white shadow-lg sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">
                Gestión de empleados
              </p>

              <h2 className="mt-1 truncate text-sm font-bold tracking-tight text-white">
                {isEdit ? "Editar Empleado" : "Añadir Nuevo Empleado"}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
              <p className="text-sm font-medium text-cyan-100">Roles</p>
              <p className="mt-1 text-sm font-bold text-white">
                {roles.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Datos personales
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Complete la información personal del empleado.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Nombres</label>
                <input
                  type="text"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Apellidos</label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.cedula && (
                  <p className={errorClass}>{errors.cedula}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.telefono && (
                  <p className={errorClass}>{errors.telefono}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>País</label>
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.fecha_nacimiento && (
                  <p className={errorClass}>{errors.fecha_nacimiento}</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información laboral
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Agregue los datos laborales y de contacto.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className={labelClass}>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.correo && (
                  <p className={errorClass}>{errors.correo}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Rol</label>
                <select
                  name="rolId"
                  value={formData.rolId}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Fecha de Contratación</label>
                <input
                  type="date"
                  name="fecha_contratacion"
                  value={formData.fecha_contratacion}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.fecha_contratacion && (
                  <p className={errorClass}>{errors.fecha_contratacion}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
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
              {isEdit ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmpleadosForm;
import { useEffect, useState } from "react";

const EmpleadosForm = ({ onSubmit, onClose, initialData = {}, isEdit = false, roles = [] }) => {
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
      if (nacimiento < new Date("1970-01-01") || nacimiento > new Date("2020-12-31")) {
        newErrors.fecha_nacimiento =
          "La fecha de nacimiento debe estar entre 1970 y 2020.";
      }
    }

    if (!formData.fecha_contratacion) {
      newErrors.fecha_contratacion = "Debe ingresar la fecha de contratación.";
    } else {
      const contratacion = new Date(formData.fecha_contratacion);
      if (contratacion < new Date("2000-01-01") || contratacion > new Date("2030-12-31")) {
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

  return (
    <div className="fixed top-[100px] left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl">
      <form
        onSubmit={handleSubmit}
        className="bg-[#F9FAFB] rounded-xl p-8 shadow-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-8 text-center">
          {isEdit ? "Editar Empleado" : "Añadir Nuevo Empleado"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-4">

            <div>
              <label className="block text-gray-900 font-medium mb-1">Nombres</label>
              <input
                type="text"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Cédula</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.cedula && (
                <p className="text-red-600 text-sm mt-1">{errors.cedula}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Correo</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.correo && (
                <p className="text-red-600 text-sm mt-1">{errors.correo}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.telefono && (
                <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">

            <div>
              <label className="block text-gray-900 font-medium mb-1">País</label>
              <input
                type="text"
                name="pais"
                value={formData.pais}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.fecha_nacimiento && (
                <p className="text-red-600 text-sm mt-1">{errors.fecha_nacimiento}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Fecha de Contratación</label>
              <input
                type="date"
                name="fecha_contratacion"
                value={formData.fecha_contratacion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.fecha_contratacion && (
                <p className="text-red-600 text-sm mt-1">{errors.fecha_contratacion}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Rol</label>
              <select
                name="rolId"
                value={formData.rolId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            {isEdit ? "Actualizar" : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-900 text-base font-medium px-7 py-3 rounded-md hover:bg-gray-400 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmpleadosForm;

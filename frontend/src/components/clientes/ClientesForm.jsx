import { useEffect, useState } from "react";

const ClientesForm = ({ onSubmit, onClose, initialData = {}, isEdit = false }) => {
  const [formData, setFormData] = useState({
    id: "",
    nombreEmpresa: "",
    nombreContacto: "",
    cargoContacto: "",
    direccion: "",
    ciudad: "",
    pais: "",
    telefono: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || "",
        nombreEmpresa: initialData.nombreEmpresa || "",
        nombreContacto: initialData.nombreContacto || "",
        cargoContacto: initialData.cargoContacto || "",
        direccion: initialData.direccion || "",
        ciudad: initialData.ciudad || "",
        pais: initialData.pais || "",
        telefono: initialData.telefono || "",
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

    if (!formData.id.toString().trim()) {
      newErrors.id = "El ID del cliente es obligatorio.";
    } else if (formData.id.toString().length !== 5) {
      newErrors.id = "El ID debe tener exactamente 5 caracteres.";
    }

    if (!formData.nombreEmpresa.trim()) {
      newErrors.nombreEmpresa = "El nombre de la empresa es obligatorio.";
    }

    if (!formData.nombreContacto.trim()) {
      newErrors.nombreContacto = "El nombre del contacto es obligatorio.";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio.";
    } else if (!/^[0-9]+$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe contener solo números.";
    } else if (formData.telefono.length < 8) {
      newErrors.telefono = "El teléfono debe tener al menos 8 dígitos.";
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
          {isEdit ? "Editar Cliente" : "Añadir Nuevo Cliente"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">

            <div>
              <label className="block text-gray-900 font-medium mb-1">ID del Cliente</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                readOnly={isEdit}
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 ${
                  isEdit ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {errors.id && <p className="text-red-600 text-sm mt-1">{errors.id}</p>}
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Nombre de Empresa</label>
              <input
                type="text"
                name="nombreEmpresa"
                value={formData.nombreEmpresa}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.nombreEmpresa && (
                <p className="text-red-600 text-sm mt-1">{errors.nombreEmpresa}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Nombre del Contacto</label>
              <input
                type="text"
                name="nombreContacto"
                value={formData.nombreContacto}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {errors.nombreContacto && (
                <p className="text-red-600 text-sm mt-1">{errors.nombreContacto}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-900 font-medium mb-1">Cargo del Contacto</label>
              <input
                type="text"
                name="cargoContacto"
                value={formData.cargoContacto}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="space-y-4">

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
              <label className="block text-gray-900 font-medium mb-1">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={formData.ciudad}
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
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="text-white text-base font-medium px-7 py-3 rounded-md transition hover:scale-105"
            style={{ backgroundColor: "#1A2E81", minWidth: "130px" }}
          >
            {isEdit ? "Guardar Cambios" : "Guardar"}
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

export default ClientesForm;

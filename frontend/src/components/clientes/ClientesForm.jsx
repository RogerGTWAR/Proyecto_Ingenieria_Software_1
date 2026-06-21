import { useEffect, useState } from "react";

const ClientesForm = ({
  onSubmit,
  onClose,
  initialData = {},
  isEdit = false,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    tipoCliente: "Persona Natural",
    numeroIdentificacion: "",
    nombreEmpresa: "",
    nombreContacto: "",
    cargoContacto: "",
    direccion: "",
    ciudad: "",
    pais: "",
    telefono: "",
    correo: "",
  });

  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || "",
        tipoCliente: initialData.tipoCliente || "Persona Natural",
        numeroIdentificacion: initialData.numeroIdentificacion || "",
        nombreEmpresa: initialData.nombreEmpresa || "",
        nombreContacto: initialData.nombreContacto || "",
        cargoContacto: initialData.cargoContacto || "",
        direccion: initialData.direccion || "",
        ciudad: initialData.ciudad || "",
        pais: initialData.pais || "",
        telefono: initialData.telefono || "",
        correo: initialData.correo || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.id.toString().trim()) {
      newErrors.id = "El ID del cliente es obligatorio.";
    } else if (formData.id.toString().length !== 5) {
      newErrors.id = "El ID debe tener exactamente 5 caracteres.";
    }

    if (!formData.tipoCliente.trim()) {
      newErrors.tipoCliente = "El tipo de cliente es obligatorio.";
    }

    if (!formData.nombreEmpresa.trim()) {
      newErrors.nombreEmpresa = "El nombre del cliente es obligatorio.";
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

    if (
      formData.correo.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)
    ) {
      newErrors.correo = "El correo no tiene un formato válido.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guardando) return;

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setGuardando(true);
      await onSubmit(formData);
    } finally {
      setGuardando(false);
    }
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
          <p className="text-sm font-medium text-cyan-100">
            Gestión de clientes
          </p>

          <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
            {isEdit ? "Editar Cliente" : "Añadir Nuevo Cliente"}
          </h2>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información principal
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Complete los datos principales del cliente.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className={labelClass}>ID del Cliente</label>

                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  readOnly={isEdit}
                  placeholder="Ejemplo: C0001"
                  className={`${inputClass} ${
                    isEdit ? "cursor-not-allowed bg-slate-300" : ""
                  }`}
                />

                {errors.id && <p className={errorClass}>{errors.id}</p>}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Tipo de Cliente</label>

                <select
                  name="tipoCliente"
                  value={formData.tipoCliente}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="Persona Natural">Persona Natural</option>
                  <option value="Persona Jurídica">Persona Jurídica</option>
                </select>

                {errors.tipoCliente && (
                  <p className={errorClass}>{errors.tipoCliente}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Número de Identificación</label>

                <input
                  type="text"
                  name="numeroIdentificacion"
                  value={formData.numeroIdentificacion}
                  onChange={handleChange}
                  placeholder="Ejemplo: 001-120595-1001A"
                  className={inputClass}
                />
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Nombre del Cliente</label>

                <input
                  type="text"
                  name="nombreEmpresa"
                  value={formData.nombreEmpresa}
                  onChange={handleChange}
                  required
                  placeholder="Ejemplo: Constructora Pérez"
                  className={inputClass}
                />

                {errors.nombreEmpresa && (
                  <p className={errorClass}>{errors.nombreEmpresa}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Nombre del Contacto</label>

                <input
                  type="text"
                  name="nombreContacto"
                  value={formData.nombreContacto}
                  onChange={handleChange}
                  placeholder="Ejemplo: Juan Pérez"
                  className={inputClass}
                />

                {errors.nombreContacto && (
                  <p className={errorClass}>{errors.nombreContacto}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Cargo del Contacto</label>

                <input
                  type="text"
                  name="cargoContacto"
                  value={formData.cargoContacto}
                  onChange={handleChange}
                  placeholder="Ejemplo: Gerente"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Ubicación y contacto
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Agregue los datos de contacto y ubicación.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className={labelClass}>Teléfono</label>

                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ejemplo: 88889999"
                  className={inputClass}
                />

                {errors.telefono && (
                  <p className={errorClass}>{errors.telefono}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Correo</label>

                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Ejemplo: cliente@correo.com"
                  className={inputClass}
                />

                {errors.correo && (
                  <p className={errorClass}>{errors.correo}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>País</label>

                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  placeholder="Ejemplo: Nicaragua"
                  className={inputClass}
                />
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Ciudad</label>

                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  placeholder="Ejemplo: Managua"
                  className={inputClass}
                />
              </div>

              <div className="min-w-0 md:col-span-2">
                <label className={labelClass}>Dirección</label>

                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Dirección del cliente"
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
              disabled={guardando}
              className="
                w-full
                rounded-2xl
                border
                border-slate-400
                bg-slate-100
                px-8
                py-3
                text-sm
                font-bold
                text-slate-800
                shadow-sm
                transition
                hover:bg-slate-300
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              className="
                w-full
                rounded-2xl
                bg-gradient-to-r
                from-blue-800
                to-cyan-700
                px-8
                py-3
                text-sm
                font-bold
                text-white
                shadow-lg
                transition
                hover:scale-[1.01]
                hover:shadow-xl
                disabled:cursor-not-allowed
                disabled:opacity-60
                disabled:hover:scale-100
                sm:w-auto
              "
            >
              {guardando
                ? "Guardando..."
                : isEdit
                ? "Guardar Cambios"
                : "Guardar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ClientesForm;
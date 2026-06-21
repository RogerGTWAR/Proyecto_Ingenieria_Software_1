import { useEffect, useState } from "react";
import { useCategoriasProveedor } from "../../hooks/useCategoriasProveedores";

const ProveedoresForm = ({ onSubmit, onClose, initialData, isEdit }) => {
  const { items: categorias } = useCategoriasProveedor();

  const [form, setForm] = useState({
    categoria_proveedor_id: "",
    nombre_empresa: "",
    nombre_contacto: "",
    cargo_contacto: "",
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
      setForm({
        categoria_proveedor_id: initialData.categoria_proveedor_id ?? "",
        nombre_empresa: initialData.nombre_empresa ?? "",
        nombre_contacto: initialData.nombre_contacto ?? "",
        cargo_contacto: initialData.cargo_contacto ?? "",
        direccion: initialData.direccion ?? "",
        ciudad: initialData.ciudad ?? "",
        pais: initialData.pais ?? "",
        telefono: initialData.telefono ?? "",
        correo: initialData.correo ?? "",
      });
    } else {
      setForm({
        categoria_proveedor_id: "",
        nombre_empresa: "",
        nombre_contacto: "",
        cargo_contacto: "",
        direccion: "",
        ciudad: "",
        pais: "",
        telefono: "",
        correo: "",
      });
    }
  }, [initialData]);

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
    const newErrors = {};

    const letrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const telefonoRegex = /^[0-9]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const nombreEmpresa = form.nombre_empresa.trim();
    const nombreContacto = form.nombre_contacto.trim();
    const cargoContacto = form.cargo_contacto.trim();
    const telefono = form.telefono.trim();
    const correo = form.correo.trim();

    if (!form.categoria_proveedor_id) {
      newErrors.categoria_proveedor_id = "Seleccione una categoría.";
    }

    if (!nombreEmpresa) {
      newErrors.nombre_empresa = "El nombre de la empresa es obligatorio.";
    } else if (nombreEmpresa.length < 3) {
      newErrors.nombre_empresa =
        "El nombre de la empresa debe tener al menos 3 caracteres.";
    }

    if (!nombreContacto) {
      newErrors.nombre_contacto = "El nombre del contacto es obligatorio.";
    } else if (nombreContacto.length < 3) {
      newErrors.nombre_contacto =
        "El nombre del contacto debe tener al menos 3 caracteres.";
    } else if (!letrasRegex.test(nombreContacto)) {
      newErrors.nombre_contacto =
        "El nombre del contacto solo debe contener letras.";
    }

    if (!cargoContacto) {
      newErrors.cargo_contacto = "El cargo del contacto es obligatorio.";
    }

    if (!telefono) {
      newErrors.telefono = "El teléfono es obligatorio.";
    } else if (!telefonoRegex.test(telefono)) {
      newErrors.telefono = "El teléfono debe contener solo números.";
    } else if (telefono.length < 8) {
      newErrors.telefono = "El teléfono debe tener al menos 8 dígitos.";
    } else if (telefono.length > 15) {
      newErrors.telefono = "El teléfono no debe superar los 15 dígitos.";
    }

    if (!correo) {
      newErrors.correo = "El correo es obligatorio.";
    } else if (!emailRegex.test(correo)) {
      newErrors.correo = "Ingrese un correo válido.";
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
      await onSubmit(form);
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
        fixed left-0 right-0 bottom-0 top-16 z-40
        flex items-center justify-center overflow-y-auto
        bg-slate-900/35 px-4 py-6 lg:left-48
      "
    >
      <form
        onSubmit={handleSubmit}
        className="
          flex w-full max-w-5xl max-h-[calc(100dvh-96px)]
          flex-col overflow-hidden rounded-3xl
          border border-slate-300 bg-slate-100 shadow-2xl
        "
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white shadow-lg sm:px-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">
                Gestión de proveedores
              </p>

              <h2 className="mt-1 truncate text-sm font-bold tracking-tight text-white">
                {isEdit ? "Editar Proveedor" : "Nuevo Proveedor"}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
              <p className="text-sm font-medium text-cyan-100">
                Categorías disponibles
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {categorias.length}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información del proveedor
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Complete los datos principales de la empresa proveedora.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className={labelClass}>Categoría</label>

                <select
                  name="categoria_proveedor_id"
                  value={form.categoria_proveedor_id}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Seleccione una categoría</option>

                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre_categoria}
                    </option>
                  ))}
                </select>

                {errors.categoria_proveedor_id && (
                  <p className={errorClass}>
                    {errors.categoria_proveedor_id}
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Empresa</label>

                <input
                  type="text"
                  name="nombre_empresa"
                  value={form.nombre_empresa}
                  onChange={handleChange}
                  placeholder="Ejemplo: Casa Pellas"
                  className={inputClass}
                />

                {errors.nombre_empresa && (
                  <p className={errorClass}>{errors.nombre_empresa}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Nombre Contacto</label>

                <input
                  type="text"
                  name="nombre_contacto"
                  value={form.nombre_contacto}
                  onChange={handleChange}
                  placeholder="Ejemplo: Juan Pérez"
                  className={inputClass}
                />

                {errors.nombre_contacto && (
                  <p className={errorClass}>{errors.nombre_contacto}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Cargo Contacto</label>

                <input
                  type="text"
                  name="cargo_contacto"
                  value={form.cargo_contacto}
                  onChange={handleChange}
                  placeholder="Ejemplo: Gerente de ventas"
                  className={inputClass}
                />

                {errors.cargo_contacto && (
                  <p className={errorClass}>{errors.cargo_contacto}</p>
                )}
              </div>

              <div className="min-w-0 md:col-span-2">
                <label className={labelClass}>Dirección</label>

                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Ejemplo: Carretera Norte, Managua"
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
                Agregue los datos de contacto del proveedor.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className={labelClass}>Ciudad</label>

                <input
                  type="text"
                  name="ciudad"
                  value={form.ciudad}
                  onChange={handleChange}
                  placeholder="Ejemplo: Managua"
                  className={inputClass}
                />
              </div>

              <div className="min-w-0">
                <label className={labelClass}>País</label>

                <input
                  type="text"
                  name="pais"
                  value={form.pais}
                  onChange={handleChange}
                  placeholder="Ejemplo: Nicaragua"
                  className={inputClass}
                />
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Teléfono</label>

                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
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
                  value={form.correo}
                  onChange={handleChange}
                  placeholder="Ejemplo: proveedor@empresa.com"
                  className={inputClass}
                />

                {errors.correo && (
                  <p className={errorClass}>{errors.correo}</p>
                )}
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
                ? "Actualizar Proveedor"
                : "Guardar Proveedor"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProveedoresForm;
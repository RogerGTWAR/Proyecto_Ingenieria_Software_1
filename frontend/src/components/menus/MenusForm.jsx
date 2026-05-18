import React, { useEffect, useMemo, useState } from "react";

const MenuForm = ({
  onSubmit,
  onClose,
  initialData = null,
  isEdit = false,
  menus = [],
}) => {
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nombre: "",
    url: "",
    parentId: "",
    es_submenu: false,
    estado: true,
    show: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        nombre: initialData.nombre ?? "",
        url: initialData.url ?? "",
        parentId: initialData.parentId ?? "",
        es_submenu: Boolean(initialData.esSubmenu),
        estado: Boolean(initialData.estado),
        show: Boolean(initialData.show),
      });
    }
  }, [initialData]);

  const menusPrincipales = useMemo(() => {
    return menus
      .filter((m) => m.esSubmenu === false)
      .filter((m) => m.parentId === null || m.parentId === "")
      .filter((m) => m.estado === true)
      .filter((m) => m.show === true)
      .filter((m) => m.id !== initialData?.id);
  }, [menus, initialData]);

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
  const errorClass = "mt-1 text-sm font-medium text-red-600";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre del menú es obligatorio.";
    }

    if (form.url.trim() && !form.url.trim().startsWith("/")) {
      newErrors.url = "La ruta debe iniciar con /. Ejemplo: /clientes";
    }

    if (form.es_submenu && !form.parentId) {
      newErrors.parentId = "Debe seleccionar un menú principal.";
    }

    if (!form.es_submenu && form.parentId) {
      newErrors.parentId =
        "Un menú principal no debe tener otro menú padre asignado.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const parentIdFinal =
      form.parentId === "" || form.parentId === undefined || form.parentId === null
        ? null
        : Number(form.parentId);

    onSubmit({
      ...form,
      esSubmenu: form.es_submenu,
      parentId: parentIdFinal,
    });
  };

  const estadoLabel = form.estado ? "Activo" : "Inactivo";
  const tipoLabel = form.es_submenu ? "Submenú" : "Menú principal";
  const visibleLabel = form.show ? "Visible" : "Oculto";

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
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">
                Configuración del sistema
              </p>

              <h2 className="mt-1 truncate text-sm font-bold tracking-tight text-white">
                {isEdit ? "Actualizar Menú" : "Nuevo Menú"}
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Administre el nombre, ruta, tipo, visibilidad y estado del menú.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SummaryBox label="Tipo" value={tipoLabel} />
              <SummaryBox label="Estado" value={estadoLabel} />
              <SummaryBox label="Vista" value={visibleLabel} />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Información general
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Complete los datos principales del menú o submenú.
                </p>
              </div>

              <span
                className={`
                  w-fit rounded-full border px-4 py-2 text-sm font-bold
                  ${
                    form.estado
                      ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                      : "border-red-200 bg-red-100 text-red-800"
                  }
                `}
              >
                {estadoLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className={labelClass}>Nombre</label>

                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ejemplo: Clientes"
                  className={inputClass}
                />

                {errors.nombre && (
                  <p className={errorClass}>{errors.nombre}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Ruta / URL</label>

                <input
                  type="text"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="/ruta-ejemplo"
                  className={inputClass}
                />

                {errors.url && <p className={errorClass}>{errors.url}</p>}
              </div>

              <div className="min-w-0 md:col-span-2">
                <label className={labelClass}>Menú principal</label>

                <select
                  name="parentId"
                  value={form.parentId ?? ""}
                  onChange={handleChange}
                  disabled={!form.es_submenu}
                  className={`
                    ${inputClass}
                    ${
                      !form.es_submenu
                        ? "cursor-not-allowed opacity-70"
                        : ""
                    }
                  `}
                >
                  <option value="">-- Sin menú principal --</option>

                  {menusPrincipales.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>

                {errors.parentId && (
                  <p className={errorClass}>{errors.parentId}</p>
                )}

                {!form.es_submenu && (
                  <p className="mt-2 text-sm text-slate-600">
                    Active la opción de submenú para seleccionar un menú padre.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Configuración del menú
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Defina si será submenú, si estará activo y si será visible.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <ToggleCard
                name="es_submenu"
                checked={form.es_submenu}
                onChange={handleChange}
                title="Submenú"
                description="Pertenece a un menú principal."
                activeText="Submenú"
                inactiveText="Menú principal"
              />

              <ToggleCard
                name="estado"
                checked={form.estado}
                onChange={handleChange}
                title="Estado"
                description="Permite activar o desactivar el menú."
                activeText="Activo"
                inactiveText="Inactivo"
                variant="green"
              />

              <ToggleCard
                name="show"
                checked={form.show}
                onChange={handleChange}
                title="Visibilidad"
                description="Controla si se mostrará en el sidebar."
                activeText="Visible"
                inactiveText="Oculto"
                variant="blue"
              />
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
              {isEdit ? "Actualizar Menú" : "Guardar Menú"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const SummaryBox = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
    <p className="text-sm font-medium text-cyan-100">{label}</p>
    <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
  </div>
);

const ToggleCard = ({
  name,
  checked,
  onChange,
  title,
  description,
  activeText,
  inactiveText,
  variant = "default",
}) => {
  const activeStyles = {
    default: "border-cyan-200 bg-cyan-100 text-cyan-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
    blue: "border-blue-200 bg-blue-100 text-blue-800",
  };

  return (
    <label
      className={`
        cursor-pointer rounded-3xl border p-4 shadow-sm transition
        hover:-translate-y-0.5 hover:shadow-md
        ${
          checked
            ? activeStyles[variant]
            : "border-slate-300 bg-slate-100 text-slate-800"
        }
      `}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-1 text-sm leading-5 opacity-80">{description}</p>
        </div>

        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="mt-1 h-5 w-5 cursor-pointer accent-blue-700"
        />
      </div>

      <span className="rounded-full border border-current px-3 py-1 text-sm font-bold">
        {checked ? activeText : inactiveText}
      </span>
    </label>
  );
};

export default MenuForm;
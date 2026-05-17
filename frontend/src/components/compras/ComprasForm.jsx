import React, { useState, useEffect, useMemo } from "react";
import { useProveedores } from "../../hooks/useProveedores";
import { useMateriales } from "../../hooks/useMateriales";
import { useDetallesCompras } from "../../hooks/useDetallesCompras";
import { useEmpleados } from "../../hooks/useEmpleados";

export default function ComprasForm({ onSubmit, onClose, initialData, isEdit }) {
  const { items: proveedores } = useProveedores();
  const { items: materiales } = useMateriales();
  const { items: empleados } = useEmpleados();
  const { items: detalles, add, edit, remove, reload } = useDetallesCompras();

  const [errors, setErrors] = useState({});
  const [materialSeleccionado, setMaterialSeleccionado] = useState("");
  const [busquedaProveedor, setBusquedaProveedor] = useState("");
  const [busquedaEmpleado, setBusquedaEmpleado] = useState("");
  const [busquedaMaterial, setBusquedaMaterial] = useState("");
  const [materialesAsignados, setMaterialesAsignados] = useState([]);

  const [form, setForm] = useState({
    proveedor_id: "",
    empleado_id: "",
    numero_factura: "",
    fecha_compra: "",
    estado: "Pendiente",
    observaciones: "",
  });

  const empleadoAsignado = empleados.find(
    (e) => Number(e.id) === Number(form.empleado_id)
  );

  const proveedorAsignado = proveedores.find(
    (p) => Number(p.id) === Number(form.proveedor_id)
  );

  useEffect(() => {
    if (!initialData) {
      setForm({
        proveedor_id: "",
        empleado_id: "",
        numero_factura: "",
        fecha_compra: "",
        estado: "Pendiente",
        observaciones: "",
      });
      setMaterialesAsignados([]);
      return;
    }

    if (materiales.length === 0 || detalles.length === 0) return;

    const compraId = Number(initialData.compra_id ?? initialData.id);

    setForm({
      proveedor_id: initialData.proveedor_id,
      empleado_id: initialData.empleado_id,
      numero_factura: initialData.numero_factura,
      fecha_compra: initialData.fecha_compra,
      estado: initialData.estado,
      observaciones: initialData.observaciones ?? "",
    });

    const asignados = detalles
      .filter((d) => Number(d.compraId) === compraId)
      .map((d) => ({
        detalle_id: d.id,
        material_id: d.materialId,
        nombre: d.materialNombre,
        unidad: d.unidadDeMedida,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        subtotal: Number(d.cantidad) * Number(d.precio_unitario),
      }));

    setMaterialesAsignados(asignados);
  }, [initialData, materiales, detalles]);

  const empleadosFiltrados = useMemo(() => {
    if (!busquedaEmpleado.trim() || form.empleado_id) return [];

    return empleados.filter((e) =>
      `${e.nombres} ${e.apellidos}`
        .toLowerCase()
        .includes(busquedaEmpleado.toLowerCase())
    );
  }, [busquedaEmpleado, empleados, form.empleado_id]);

  const proveedoresFiltrados = useMemo(() => {
    if (!busquedaProveedor.trim() || form.proveedor_id) return [];

    return proveedores.filter((p) =>
      p.nombre_empresa.toLowerCase().includes(busquedaProveedor.toLowerCase())
    );
  }, [busquedaProveedor, proveedores, form.proveedor_id]);

  const materialesFiltrados = useMemo(() => {
    if (!busquedaMaterial.trim()) return [];

    return materiales.filter((m) =>
      m.nombre_material.toLowerCase().includes(busquedaMaterial.toLowerCase())
    );
  }, [busquedaMaterial, materiales]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAsignarMaterial = () => {
    if (!materialSeleccionado) {
      setErrors((prev) => ({
        ...prev,
        asignarMaterial: "Debe seleccionar un material.",
      }));
      return;
    }

    const mat = materiales.find(
      (m) => Number(m.id) === Number(materialSeleccionado)
    );

    if (!mat) return;

    const existe = materialesAsignados.some(
      (m) => Number(m.material_id) === Number(mat.id)
    );

    if (existe) {
      setErrors((prev) => ({
        ...prev,
        asignarMaterial: "Este material ya está asignado.",
      }));
      return;
    }

    const precio = Number(mat.precio_unitario ?? 0);

    setMaterialesAsignados((prev) => [
      ...prev,
      {
        detalle_id: null,
        material_id: mat.id,
        nombre: mat.nombre_material,
        unidad: mat.unidad_de_medida,
        cantidad: 1,
        precio_unitario: precio,
        subtotal: precio,
      },
    ]);

    setBusquedaMaterial("");
    setMaterialSeleccionado("");
    setErrors((prev) => ({ ...prev, asignarMaterial: "" }));
  };

  const handleQuitarMaterial = async (mat) => {
    const compraId = Number(initialData?.compra_id ?? initialData?.id);

    const detalle = detalles.find(
      (d) =>
        Number(d.materialId) === Number(mat.material_id) &&
        Number(d.compraId) === compraId
    );

    if (detalle) {
      await remove(detalle.id);
      await reload();
    }

    setMaterialesAsignados((prev) =>
      prev.filter((m) => Number(m.material_id) !== Number(mat.material_id))
    );
  };

  const validateForm = () => {
    const e = {};

    if (!form.empleado_id) e.empleado_id = "Seleccione un empleado.";
    if (!form.proveedor_id) e.proveedor_id = "Seleccione un proveedor.";
    if (!form.numero_factura.trim()) e.numero_factura = "Campo obligatorio.";
    if (!form.fecha_compra) e.fecha_compra = "Seleccione una fecha.";

    if (materialesAsignados.length === 0) {
      e.asignarMaterial = "Debe asignar al menos un material.";
    }

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eForm = validateForm();

    if (Object.keys(eForm).length > 0) {
      setErrors(eForm);
      return;
    }

    const compraGuardada = await onSubmit(form);
    const compraId = Number(compraGuardada.id);

    for (const m of materialesAsignados) {
      const existe = detalles.find(
        (d) =>
          Number(d.materialId) === Number(m.material_id) &&
          Number(d.compraId) === compraId
      );

      if (existe) {
        await edit(existe.id, {
          cantidad: m.cantidad,
          precio_unitario: m.precio_unitario,
        });
      } else {
        await add({
          compra_id: compraId,
          material_id: m.material_id,
          cantidad: m.cantidad,
          precio_unitario: m.precio_unitario,
        });
      }
    }

    await reload();
    onClose();
  };

  const totalCompra = materialesAsignados.reduce(
    (a, b) => a + Number(b.subtotal ?? 0),
    0
  );

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

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
          flex w-full max-w-6xl max-h-[calc(100dvh-96px)]
          flex-col overflow-hidden rounded-3xl
          border border-slate-300 bg-slate-100 shadow-2xl
        "
      >
        <div className="shrink-0 bg-gradient-to-r from-slate-950 via-blue-950 to-cyan-900 px-5 py-5 text-white shadow-lg sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-cyan-100">
                Gestión de compras
              </p>

              <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
                {isEdit ? "Editar Compra" : "Nueva Compra"}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
              <p className="text-sm font-medium text-cyan-100">Total compra</p>
              <p className="mt-1 text-sm font-bold text-white">
                C${money(totalCompra)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información general
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Seleccione empleado, proveedor y datos de la factura.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <SearchBox
                label="Empleado"
                value={busquedaEmpleado}
                onChange={setBusquedaEmpleado}
                selected={empleadoAsignado}
                selectedText={
                  empleadoAsignado
                    ? `${empleadoAsignado.nombres} ${empleadoAsignado.apellidos}`
                    : ""
                }
                placeholder="Buscar empleado..."
                error={errors.empleado_id}
                results={empleadosFiltrados}
                renderItem={(e) => `${e.nombres} ${e.apellidos} — ${e.rolNombre}`}
                onSelect={(e) => {
                  setForm((prev) => ({ ...prev, empleado_id: e.id }));
                  setBusquedaEmpleado("");
                }}
                onClear={() => setForm((prev) => ({ ...prev, empleado_id: "" }))}
              />

              <SearchBox
                label="Proveedor"
                value={busquedaProveedor}
                onChange={setBusquedaProveedor}
                selected={proveedorAsignado}
                selectedText={proveedorAsignado?.nombre_empresa || ""}
                placeholder="Buscar proveedor..."
                error={errors.proveedor_id}
                results={proveedoresFiltrados}
                renderItem={(p) => p.nombre_empresa}
                onSelect={(p) => {
                  setForm((prev) => ({ ...prev, proveedor_id: p.id }));
                  setBusquedaProveedor("");
                }}
                onClear={() => setForm((prev) => ({ ...prev, proveedor_id: "" }))}
              />

              <div>
                <label className={labelClass}>Número Factura</label>
                <input
                  type="text"
                  name="numero_factura"
                  value={form.numero_factura}
                  onChange={handleChange}
                  placeholder="Ejemplo: FAC-001"
                  className={inputClass}
                />
                {errors.numero_factura && (
                  <p className={errorClass}>{errors.numero_factura}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Fecha Compra</label>
                <input
                  type="date"
                  name="fecha_compra"
                  value={form.fecha_compra}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.fecha_compra && (
                  <p className={errorClass}>{errors.fecha_compra}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Estado</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagada">Pagada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className={labelClass}>Observaciones</label>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Observaciones de la compra"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Materiales asignados
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Agregue los materiales comprados.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto]">
              <div>
                <label className={labelClass}>Buscar material</label>

                <input
                  type="text"
                  placeholder="Escribe para buscar..."
                  value={busquedaMaterial}
                  onChange={(e) => setBusquedaMaterial(e.target.value)}
                  className={inputClass}
                />

                {busquedaMaterial && (
                  <select
                    value={materialSeleccionado}
                    onChange={(e) => setMaterialSeleccionado(e.target.value)}
                    className={`${inputClass} mt-3`}
                  >
                    <option value="">Selecciona un material...</option>
                    {materialesFiltrados.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre_material} — {m.unidad_de_medida}
                      </option>
                    ))}
                  </select>
                )}

                {errors.asignarMaterial && (
                  <p className={errorClass}>{errors.asignarMaterial}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleAsignarMaterial}
                className="
                  h-fit rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700
                  px-6 py-3 text-sm font-bold text-white shadow-lg
                  transition hover:scale-[1.01] hover:shadow-xl
                "
              >
                Agregar
              </button>
            </div>

            {materialesAsignados.length > 0 && (
              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-sm">
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900 text-slate-100">
                      <tr>
                        <th className="px-4 py-4 text-left font-bold">Material</th>
                        <th className="px-4 py-4 text-center font-bold">Unidad</th>
                        <th className="px-4 py-4 text-center font-bold">Cantidad</th>
                        <th className="px-4 py-4 text-center font-bold">Precio Unit.</th>
                        <th className="px-4 py-4 text-right font-bold">Subtotal</th>
                        <th className="px-4 py-4 text-center font-bold">Acción</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-300">
                      {materialesAsignados.map((m) => (
                        <tr key={m.material_id} className="bg-slate-100 hover:bg-blue-100">
                          <td className="px-4 py-4 font-bold text-slate-900">{m.nombre}</td>
                          <td className="px-4 py-4 text-center text-slate-700">{m.unidad}</td>

                          <td className="px-4 py-4 text-center">
                            <input
                              type="number"
                              value={m.cantidad}
                              min="1"
                              step="1"
                              onChange={(e) => {
                                const q = Number(e.target.value);
                                setMaterialesAsignados((prev) =>
                                  prev.map((x) =>
                                    x.material_id === m.material_id
                                      ? { ...x, cantidad: q, subtotal: q * x.precio_unitario }
                                      : x
                                  )
                                );
                              }}
                              className="w-20 rounded-xl border border-slate-300 bg-slate-100 p-2 text-center text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                          </td>

                          <td className="px-4 py-4 text-center">
                            <input
                              type="number"
                              value={m.precio_unitario}
                              min="0.01"
                              step="0.01"
                              onChange={(e) => {
                                const p = Number(e.target.value);
                                setMaterialesAsignados((prev) =>
                                  prev.map((x) =>
                                    x.material_id === m.material_id
                                      ? { ...x, precio_unitario: p, subtotal: p * x.cantidad }
                                      : x
                                  )
                                );
                              }}
                              className="w-24 rounded-xl border border-slate-300 bg-slate-100 p-2 text-center text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                          </td>

                          <td className="px-4 py-4 text-right font-bold text-emerald-700">
                            C${money(m.subtotal)}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleQuitarMaterial(m)}
                              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 gap-3 p-3 xl:hidden">
                  {materialesAsignados.map((m) => (
                    <div
                      key={m.material_id}
                      className="rounded-2xl border border-slate-300 bg-slate-200 p-4"
                    >
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{m.nombre}</p>
                          <p className="text-sm text-slate-600">Unidad: {m.unidad}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuitarMaterial(m)}
                          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                        >
                          Quitar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className={labelClass}>Cantidad</label>
                          <input
                            type="number"
                            value={m.cantidad}
                            min="1"
                            step="1"
                            onChange={(e) => {
                              const q = Number(e.target.value);
                              setMaterialesAsignados((prev) =>
                                prev.map((x) =>
                                  x.material_id === m.material_id
                                    ? { ...x, cantidad: q, subtotal: q * x.precio_unitario }
                                    : x
                                )
                              );
                            }}
                            className={inputClass}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Precio Unitario</label>
                          <input
                            type="number"
                            value={m.precio_unitario}
                            min="0.01"
                            step="0.01"
                            onChange={(e) => {
                              const p = Number(e.target.value);
                              setMaterialesAsignados((prev) =>
                                prev.map((x) =>
                                  x.material_id === m.material_id
                                    ? { ...x, precio_unitario: p, subtotal: p * x.cantidad }
                                    : x
                                )
                              );
                            }}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-100 p-4">
                        <p className="text-sm font-semibold text-emerald-700">Subtotal</p>
                        <p className="mt-1 text-sm font-bold text-emerald-900">
                          C${money(m.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-300 bg-slate-200 p-4 text-right">
                  <p className="text-sm font-semibold text-slate-600">Total</p>
                  <p className="text-sm font-bold text-emerald-800">
                    C${money(totalCompra)}
                  </p>
                </div>
              </div>
            )}
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
              {isEdit ? "Actualizar Compra" : "Guardar Compra"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const SearchBox = ({
  label,
  value,
  onChange,
  selected,
  selectedText,
  placeholder,
  error,
  results,
  renderItem,
  onSelect,
  onClear,
}) => {
  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {!selected && (
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}

      {value && results.length > 0 && (
        <div className="mt-2 max-h-44 overflow-y-auto rounded-2xl border border-slate-300 bg-slate-100 shadow-lg">
          {results.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelect(item)}
              className="block w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-blue-100"
            >
              {renderItem(item)}
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="mt-2 flex items-center justify-between gap-3 rounded-2xl border border-slate-300 bg-slate-100 p-4">
          <p className="text-sm font-bold text-slate-800">{selectedText}</p>

          <button
            type="button"
            onClick={onClear}
            className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200"
          >
            Cambiar
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
};
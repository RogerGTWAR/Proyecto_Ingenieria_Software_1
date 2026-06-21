import { useEffect, useMemo, useState } from "react";

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
  const [guardando, setGuardando] = useState(false);

  const [materialSeleccionado, setMaterialSeleccionado] = useState("");
  const [busquedaProveedor, setBusquedaProveedor] = useState("");
  const [busquedaEmpleado, setBusquedaEmpleado] = useState("");
  const [busquedaMaterial, setBusquedaMaterial] = useState("");
  const [materialesAsignados, setMaterialesAsignados] = useState([]);

  const [modalMensaje, setModalMensaje] = useState({
    open: false,
    type: "error",
    title: "",
    message: "",
  });

  const [form, setForm] = useState({
    proveedor_id: "",
    empleado_id: "",
    numero_factura: "",
    fecha_compra: "",
    estado: "Pendiente",
    observaciones: "",
  });

  const mostrarMensaje = (type, title, message) => {
    setModalMensaje({
      open: true,
      type,
      title,
      message,
    });
  };

  const cerrarMensaje = () => {
    setModalMensaje({
      open: false,
      type: "error",
      title: "",
      message: "",
    });
  };

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

    const compraId = Number(initialData.compra_id ?? initialData.id);

    setForm({
      proveedor_id: initialData.proveedor_id ?? "",
      empleado_id: initialData.empleado_id ?? "",
      numero_factura: initialData.numero_factura ?? "",
      fecha_compra: initialData.fecha_compra ?? "",
      estado: initialData.estado ?? "Pendiente",
      observaciones: initialData.observaciones ?? "",
    });

    const asignados = detalles
      .filter((d) => Number(d.compraId ?? d.compra_id) === compraId)
      .map((d) => ({
        detalle_id: d.id,
        material_id: d.materialId ?? d.material_id,
        nombre: d.materialNombre ?? d.nombre_material ?? "Material",
        unidad: d.unidadDeMedida ?? d.unidad_de_medida ?? "",
        cantidad: Number(d.cantidad ?? 1),
        precio_unitario: Number(d.precio_unitario ?? d.precioUnitario ?? 0),
        subtotal:
          Number(d.cantidad ?? 1) *
          Number(d.precio_unitario ?? d.precioUnitario ?? 0),
      }));

    setMaterialesAsignados(asignados);
  }, [initialData, detalles]);

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

  const totalCompra = materialesAsignados.reduce(
    (a, b) => a + Number(b.subtotal ?? 0),
    0
  );

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
  const errorClass = "mt-1 text-sm font-medium text-red-600";

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

  const handleAsignarMaterial = () => {
    if (guardando) return;

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

    if (!mat) {
      setErrors((prev) => ({
        ...prev,
        asignarMaterial: "El material seleccionado no existe.",
      }));
      return;
    }

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

    if (precio <= 0) {
      setErrors((prev) => ({
        ...prev,
        asignarMaterial:
          "El material seleccionado debe tener un precio mayor que cero.",
      }));
      return;
    }

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
    setErrors((prev) => ({
      ...prev,
      asignarMaterial: "",
    }));
  };

  const handleQuitarMaterial = async (mat) => {
    if (guardando) return;

    try {
      const compraId = Number(initialData?.compra_id ?? initialData?.id);

      const detalle = detalles.find(
        (d) =>
          Number(d.materialId ?? d.material_id) === Number(mat.material_id) &&
          Number(d.compraId ?? d.compra_id) === compraId
      );

      if (detalle) {
        await remove(detalle.id);
        await reload();
      }

      setMaterialesAsignados((prev) =>
        prev.filter((m) => Number(m.material_id) !== Number(mat.material_id))
      );
    } catch (error) {
      mostrarMensaje(
        "error",
        "Error al quitar material",
        error.message || "No se pudo quitar el material de la compra."
      );
    }
  };

  const actualizarMaterialAsignado = (materialId, campo, valor) => {
    setMaterialesAsignados((prev) =>
      prev.map((item) => {
        if (Number(item.material_id) !== Number(materialId)) return item;

        const actualizado = {
          ...item,
          [campo]: valor,
        };

        const cantidad = Number(actualizado.cantidad ?? 0);
        const precio = Number(actualizado.precio_unitario ?? 0);

        return {
          ...actualizado,
          subtotal: cantidad * precio,
        };
      })
    );

    setErrors((prev) => ({
      ...prev,
      asignarMaterial: "",
    }));
  };

  const validateForm = () => {
    const e = {};

    if (!form.empleado_id) {
      e.empleado_id = "Seleccione un empleado.";
    }

    if (!form.proveedor_id) {
      e.proveedor_id = "Seleccione un proveedor.";
    }

    if (!form.numero_factura.trim()) {
      e.numero_factura = "El número de factura es obligatorio.";
    } else if (form.numero_factura.trim().length < 3) {
      e.numero_factura =
        "El número de factura debe tener al menos 3 caracteres.";
    }

    if (!form.fecha_compra) {
      e.fecha_compra = "Seleccione una fecha.";
    } else {
      const fecha = new Date(form.fecha_compra);
      const minFecha = new Date("2000-01-01");
      const hoy = new Date();

      if (fecha < minFecha || fecha > hoy) {
        e.fecha_compra =
          "La fecha de compra debe estar entre el año 2000 y la fecha actual.";
      }
    }

    if (!form.estado) {
      e.estado = "Seleccione un estado.";
    }

    if (materialesAsignados.length === 0) {
      e.asignarMaterial = "Debe asignar al menos un material.";
    }

    const materialCantidadInvalida = materialesAsignados.find(
      (m) => Number(m.cantidad) <= 0
    );

    if (materialCantidadInvalida) {
      e.asignarMaterial =
        "Cada material comprado debe tener una cantidad mayor a 0.";
    }

    const materialPrecioInvalido = materialesAsignados.find(
      (m) => Number(m.precio_unitario) <= 0
    );

    if (materialPrecioInvalido) {
      e.asignarMaterial =
        "Cada material comprado debe tener un precio unitario mayor a 0.";
    }

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guardando) return;

    const eForm = validateForm();

    if (Object.keys(eForm).length > 0) {
      setErrors(eForm);

      mostrarMensaje(
        "error",
        "Revise los datos de la compra",
        "Hay campos pendientes o valores inválidos. Revise el formulario antes de guardar."
      );

      return;
    }

    try {
      setGuardando(true);

      const compraGuardada = await onSubmit({
        ...form,
        monto_total: totalCompra,
      });

      const compraId = Number(compraGuardada?.id);

      if (!compraId) {
        mostrarMensaje(
          "error",
          "Error al guardar compra",
          "No se pudo obtener el ID de la compra guardada."
        );

        return;
      }

      for (const m of materialesAsignados) {
        const existe = detalles.find(
          (d) =>
            Number(d.materialId ?? d.material_id) === Number(m.material_id) &&
            Number(d.compraId ?? d.compra_id) === compraId
        );

        if (existe) {
          await edit(existe.id, {
            compra_id: compraId,
            material_id: m.material_id,
            cantidad: Number(m.cantidad),
            precio_unitario: Number(m.precio_unitario),
          });
        } else {
          await add({
            compra_id: compraId,
            material_id: m.material_id,
            cantidad: Number(m.cantidad),
            precio_unitario: Number(m.precio_unitario),
          });
        }
      }

      await reload();
      onClose();
    } catch (error) {
      mostrarMensaje(
        "error",
        "Error al guardar compra",
        error.message || "No se pudo guardar la compra."
      );
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
                renderItem={(e) =>
                  `${e.nombres} ${e.apellidos} — ${e.rolNombre}`
                }
                onSelect={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    empleado_id: e.id,
                  }));
                  setBusquedaEmpleado("");
                  setErrors((prev) => ({
                    ...prev,
                    empleado_id: "",
                  }));
                }}
                onClear={() =>
                  setForm((prev) => ({
                    ...prev,
                    empleado_id: "",
                  }))
                }
                disabled={guardando}
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
                  setForm((prev) => ({
                    ...prev,
                    proveedor_id: p.id,
                  }));
                  setBusquedaProveedor("");
                  setErrors((prev) => ({
                    ...prev,
                    proveedor_id: "",
                  }));
                }}
                onClear={() =>
                  setForm((prev) => ({
                    ...prev,
                    proveedor_id: "",
                  }))
                }
                disabled={guardando}
              />

              <div>
                <label className={labelClass}>Número Factura</label>
                <input
                  type="text"
                  name="numero_factura"
                  value={form.numero_factura}
                  onChange={handleChange}
                  disabled={guardando}
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
                  disabled={guardando}
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
                  disabled={guardando}
                  className={inputClass}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pagada">Pagada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>

                {errors.estado && (
                  <p className={errorClass}>{errors.estado}</p>
                )}
              </div>

              <div className="lg:col-span-2">
                <label className={labelClass}>Observaciones</label>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  disabled={guardando}
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
                  disabled={guardando}
                  className={inputClass}
                />

                {busquedaMaterial && (
                  <select
                    value={materialSeleccionado}
                    onChange={(e) => setMaterialSeleccionado(e.target.value)}
                    disabled={guardando}
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
                disabled={guardando}
                className="
                  h-fit rounded-2xl bg-gradient-to-r from-blue-800 to-cyan-700
                  px-6 py-3 text-sm font-bold text-white shadow-lg
                  transition hover:scale-[1.01] hover:shadow-xl
                  disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100
                "
              >
                Agregar
              </button>
            </div>

            {materialesAsignados.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-6 py-8 text-center">
                <p className="text-sm font-bold text-slate-700">
                  Aún no hay materiales asignados.
                </p>
              </div>
            ) : (
              <div className="mt-5 overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-sm">
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900 text-slate-100">
                      <tr>
                        <th className="px-4 py-4 text-left font-bold">
                          Material
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          Unidad
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          Cantidad
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          Precio Unit.
                        </th>
                        <th className="px-4 py-4 text-right font-bold">
                          Subtotal
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          Acción
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-300">
                      {materialesAsignados.map((m) => (
                        <tr
                          key={m.material_id}
                          className="bg-slate-100 hover:bg-blue-100"
                        >
                          <td className="px-4 py-4 font-bold text-slate-900">
                            {m.nombre}
                          </td>

                          <td className="px-4 py-4 text-center text-slate-700">
                            {m.unidad}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <input
                              type="number"
                              value={m.cantidad}
                              min="1"
                              step="1"
                              disabled={guardando}
                              onChange={(e) =>
                                actualizarMaterialAsignado(
                                  m.material_id,
                                  "cantidad",
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
                              className="w-20 rounded-xl border border-slate-300 bg-slate-100 p-2 text-center text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                          </td>

                          <td className="px-4 py-4 text-center">
                            <input
                              type="number"
                              value={m.precio_unitario}
                              min="0.01"
                              step="0.01"
                              disabled={guardando}
                              onChange={(e) =>
                                actualizarMaterialAsignado(
                                  m.material_id,
                                  "precio_unitario",
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
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
                              disabled={guardando}
                              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                          <p className="text-sm font-bold text-slate-900">
                            {m.nombre}
                          </p>
                          <p className="text-sm text-slate-600">
                            Unidad: {m.unidad}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuitarMaterial(m)}
                          disabled={guardando}
                          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                            disabled={guardando}
                            onChange={(e) =>
                              actualizarMaterialAsignado(
                                m.material_id,
                                "cantidad",
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
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
                            disabled={guardando}
                            onChange={(e) =>
                              actualizarMaterialAsignado(
                                m.material_id,
                                "precio_unitario",
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value)
                              )
                            }
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-100 p-4">
                        <p className="text-sm font-semibold text-emerald-700">
                          Subtotal
                        </p>
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
                ? "Actualizar Compra"
                : "Guardar Compra"}
            </button>
          </div>
        </div>
      </form>

      {modalMensaje.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div
            className={`
              w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-2xl
              ${
                modalMensaje.type === "error"
                  ? "border-red-200"
                  : "border-emerald-200"
              }
            `}
          >
            <div className="px-6 py-6">
              <div className="flex items-start gap-4">
                <div
                  className={`
                    flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black
                    ${
                      modalMensaje.type === "error"
                        ? "bg-red-100 text-red-600"
                        : "bg-emerald-100 text-emerald-600"
                    }
                  `}
                >
                  {modalMensaje.type === "error" ? "!" : "✓"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black text-slate-900">
                    {modalMensaje.title}
                  </h3>

                  <p className="mt-2 whitespace-pre-line text-sm font-medium leading-relaxed text-slate-600">
                    {modalMensaje.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={cerrarMensaje}
                className={`
                  rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition
                  ${
                    modalMensaje.type === "error"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }
                `}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
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
  disabled = false,
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
          disabled={disabled}
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
              disabled={disabled}
              className="block w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
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
            disabled={disabled}
            className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cambiar
          </button>
        </div>
      )}

      {error && <p className="mt-1 text-sm font-medium text-red-600">{error}</p>}
    </div>
  );
};
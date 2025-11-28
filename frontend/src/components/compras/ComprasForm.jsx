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
    if (!initialData) return;
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
        subtotal: d.cantidad * d.precio_unitario,
      }));

    setMaterialesAsignados(asignados);
  }, [initialData, materiales, detalles]);

  const empleadosFiltrados = useMemo(() => {
    if (!busquedaEmpleado.trim() || form.empleado_id) return [];
    return empleados.filter((e) =>
      `${e.nombres} ${e.apellidos}`.toLowerCase().includes(busquedaEmpleado.toLowerCase())
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
    if (!materialSeleccionado)
      return setErrors((prev) => ({
        ...prev,
        asignarMaterial: "Debe seleccionar un material.",
      }));

    const mat = materiales.find((m) => Number(m.id) === Number(materialSeleccionado));
    if (!mat) return;

    const existe = materialesAsignados.some(
      (m) => Number(m.material_id) === Number(mat.id)
    );

    if (existe)
      return setErrors((prev) => ({
        ...prev,
        asignarMaterial: "Este material ya está asignado.",
      }));

    setMaterialesAsignados((prev) => [
      ...prev,
      {
        detalle_id: null,
        material_id: mat.id,
        nombre: mat.nombre_material,
        unidad: mat.unidad_de_medida,
        cantidad: 1,
        precio_unitario: mat.precio_unitario,
        subtotal: mat.precio_unitario,
      },
    ]);

    setBusquedaMaterial("");
    setMaterialSeleccionado("");
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
    if (materialesAsignados.length === 0)
      e.asignarMaterial = "Debe asignar al menos un material.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eForm = validateForm();
    if (Object.keys(eForm).length > 0) return setErrors(eForm);

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

  const totalCompra = materialesAsignados.reduce((a, b) => a + b.subtotal, 0);

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[100px] z-50">
      <form
        onSubmit={handleSubmit}
        className="
          bg-[#F9FAFB] rounded-2xl shadow-2xl
          w-full max-w-3xl p-8
          max-h-[90vh] overflow-y-auto
        "
      >
        <h2 className="text-2xl font-semibold text-[#1A2E81] text-center mb-6">
          {isEdit ? "Editar Compra" : "Nueva Compra"}
        </h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Empleado
          </label>

          {!empleadoAsignado && (
            <input
              type="text"
              placeholder="Buscar empleado..."
              value={busquedaEmpleado}
              onChange={(e) => setBusquedaEmpleado(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          )}

          {busquedaEmpleado && empleadosFiltrados.length > 0 && (
            <div className="border rounded bg-white shadow max-h-40 overflow-y-auto mt-1">
              {empleadosFiltrados.map((e) => (
                <div
                  key={e.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, empleado_id: e.id })) ||
                    setBusquedaEmpleado("")
                  }
                >
                  {e.nombres} {e.apellidos} — {e.rolNombre}
                </div>
              ))}
            </div>
          )}

          {empleadoAsignado && (
            <div className="mt-3 bg-gray-100 p-3 rounded flex justify-between">
              <p className="font-medium">
                {empleadoAsignado.nombres} {empleadoAsignado.apellidos}
              </p>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, empleado_id: "" }))
                }
                className="text-red-600 hover:underline"
              >
                Cambiar
              </button>
            </div>
          )}

          {errors.empleado_id && (
            <p className="text-red-600 text-sm">{errors.empleado_id}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Proveedor
          </label>

          {!proveedorAsignado && (
            <input
              type="text"
              placeholder="Buscar proveedor..."
              value={busquedaProveedor}
              onChange={(e) => setBusquedaProveedor(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          )}

          {busquedaProveedor && proveedoresFiltrados.length > 0 && (
            <div className="border rounded bg-white shadow max-h-40 overflow-y-auto mt-1">
              {proveedoresFiltrados.map((p) => (
                <div
                  key={p.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, proveedor_id: p.id })) ||
                    setBusquedaProveedor("")
                  }
                >
                  {p.nombre_empresa}
                </div>
              ))}
            </div>
          )}

          {proveedorAsignado && (
            <div className="mt-3 bg-gray-100 p-3 rounded flex justify-between">
              <p className="font-medium">{proveedorAsignado.nombre_empresa}</p>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, proveedor_id: "" }))
                }
                className="text-red-600 hover:underline"
              >
                Cambiar
              </button>
            </div>
          )}

          {errors.proveedor_id && (
            <p className="text-red-600 text-sm">{errors.proveedor_id}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Número Factura
            </label>
            <input
              type="text"
              name="numero_factura"
              value={form.numero_factura}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.numero_factura && (
              <p className="text-red-600 text-sm">{errors.numero_factura}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Fecha Compra
            </label>
            <input
              type="date"
              name="fecha_compra"
              value={form.fecha_compra}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.fecha_compra && (
              <p className="text-red-600 text-sm">{errors.fecha_compra}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Estado
          </label>

          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Pagada">Pagada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <h3 className="text-lg font-semibold text-[#1A2E81] mb-2">
          Materiales Asignados
        </h3>

        <div className="bg-[#F9FAFB] border p-4 rounded-xl shadow-sm mb-4">
          <div className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-8">
              <label className="block text-sm font-medium text-gray-800">
                Buscar material
              </label>
              <input
                type="text"
                placeholder="Escribe para buscar..."
                value={busquedaMaterial}
                onChange={(e) => setBusquedaMaterial(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />

              {busquedaMaterial && (
                <select
                  value={materialSeleccionado}
                  onChange={(e) => setMaterialSeleccionado(e.target.value)}
                  className="w-full mt-2 border border-gray-300 rounded-md p-2"
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
                <p className="text-red-600 text-sm mt-1">{errors.asignarMaterial}</p>
              )}
            </div>

            <div className="col-span-4">
              <button
                type="button"
                onClick={handleAsignarMaterial}
                className="w-full h-[42px] bg-[#1A2E81] text-white rounded-md shadow hover:bg-[#2538a3]"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>

        {materialesAsignados.length > 0 && (
          <div className="overflow-auto rounded-xl border bg-[#F9FAFB] shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-3 text-left font-semibold">Material</th>
                  <th className="p-3 text-center font-semibold">Unidad</th>
                  <th className="p-3 text-center font-semibold">Cantidad</th>
                  <th className="p-3 text-center font-semibold">Precio Unit.</th>
                  <th className="p-3 text-right font-semibold">Subtotal</th>
                  <th className="p-3 text-center"></th>
                </tr>
              </thead>

              <tbody>
                {materialesAsignados.map((m) => (
                  <tr key={m.material_id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{m.nombre}</td>
                    <td className="p-3 text-center">{m.unidad}</td>

                    <td className="p-3 text-center">
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
                        className="w-20 border rounded p-1 text-center"
                      />
                    </td>

                    <td className="p-3 text-center">
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
                        className="w-24 border rounded p-1 text-center"
                      />
                    </td>

                    <td className="p-3 text-right font-semibold text-green-700">
                      C${m.subtotal.toLocaleString("es-NI")}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleQuitarMaterial(m)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 text-right font-bold text-lg text-red-700">
              Total: C${totalCompra.toLocaleString("es-NI")}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="px-10 py-3 text-white rounded-md shadow-md"
            style={{ backgroundColor: "#1A2E81" }}
          >
            {isEdit ? "Actualizar" : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-10 py-3 bg-gray-300 text-gray-900 rounded-md shadow-md hover:bg-gray-400"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
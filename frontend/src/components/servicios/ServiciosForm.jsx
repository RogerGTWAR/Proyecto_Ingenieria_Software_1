import React, { useEffect, useState } from "react";
import { useMateriales } from "../../hooks/useMateriales";
import { useCostosDirectos } from "../../hooks/useCostosDirectos";
import { useCostosIndirectos } from "../../hooks/useCostosIndirectos";

export default function ServiciosForm({ onSubmit, onClose, initialData, isEdit }) {
  const { items: materiales } = useMateriales();
  const {
    items: directos,
    add: addDirecto,
    edit: editDirecto,
    reload: reloadDirectos,
  } = useCostosDirectos();
  const {
    items: indirectos,
    add: addIndirecto,
    edit: editIndirecto,
    reload: reloadIndirectos,
  } = useCostosIndirectos();

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id: "",
    nombreServicio: "",
    descripcion: "",
  });

  const [busquedaMaterial, setBusquedaMaterial] = useState("");
  const [materialSeleccionado, setMaterialSeleccionado] = useState("");

  const [costosDirectosAsignados, setCostosDirectosAsignados] = useState([]);
  const [costosIndirectosAsignados, setCostosIndirectosAsignados] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        nombreServicio: initialData.nombreServicio,
        descripcion: initialData.descripcion,
      });

      setCostosDirectosAsignados(
        directos
          .filter((d) => Number(d.servicioId) === Number(initialData.id))
          .map((d) => ({
            id: d.id,
            materialId: d.materialId,
            nombre: d.materialNombre,
            cantidad_material: d.cantidadMaterial,
            unidad_de_medida: d.unidadMedida,
            precio_unitario: d.precioUnitario,
            costo_material: d.costoMaterial,
            mano_obra: d.manoObra,
            equipos: d.equiposTransporteHerramientas,
            total: d.totalCostoDirecto,
          }))
      );

      setCostosIndirectosAsignados(
        indirectos
          .filter((i) => Number(i.servicioId) === Number(initialData.id))
          .map((i) => ({
            id: i.id,
            total_costo_directo: i.totalCostoDirecto,
            administracion: i.administracion,
            operacion: i.operacion,
            utilidad: i.utilidad,
            total: i.totalCostoIndirecto,
          }))
      );
    }
  }, [initialData, directos, indirectos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const materialesFiltrados = materiales.filter((m) =>
    m.nombre_material.toLowerCase().includes(busquedaMaterial.toLowerCase())
  );

  const handleAsignarMaterial = () => {
    const newErrors = {};

    if (!materialSeleccionado) {
      newErrors.asignarMaterial = "Debe seleccionar un material.";
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    const mat = materiales.find((m) => m.id === Number(materialSeleccionado));
    if (!mat) return;

    if (costosDirectosAsignados.some((c) => c.materialId === mat.id)) {
      newErrors.asignarMaterial = "Este material ya está asignado.";
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    const base = Number(mat.precio_unitario);
    const costoMaterial = base;
    const manoObra = base * 0.4;
    const equipos = base * 0.1;
    const total = costoMaterial + manoObra + equipos;

    setCostosDirectosAsignados((prev) => [
      ...prev,
      {
        id: null,
        materialId: mat.id,
        nombre: mat.nombre_material,
        cantidad_material: 1,
        unidad_de_medida: mat.unidad_de_medida,
        precio_unitario: base,
        costo_material: costoMaterial,
        mano_obra: manoObra,
        equipos,
        total,
      },
    ]);

    setMaterialSeleccionado("");
    setBusquedaMaterial("");
    setErrors((prev) => ({ ...prev, asignarMaterial: "" }));
  };

  const actualizarDirecto = (index, campo, valor) => {
    setCostosDirectosAsignados((prev) => {
      const copia = [...prev];
      const item = { ...copia[index], [campo]: valor };

      const base = Number(item.cantidad_material) * Number(item.precio_unitario);
      item.costo_material = base;
      item.mano_obra = base * 0.4;
      item.equipos = base * 0.1;
      item.total = item.costo_material + item.mano_obra + item.equipos;

      copia[index] = item;
      return copia;
    });
  };

  const quitarDirecto = (id) =>
    setCostosDirectosAsignados((p) => p.filter((m) => m.materialId !== id));

  const generarIndirectos = () => {
    const totalDirecto = costosDirectosAsignados.reduce((acc, d) => acc + d.total, 0);

    const admin = totalDirecto * 0.05;
    const oper = totalDirecto * 0.1;
    const util = totalDirecto * 0.15;

    setCostosIndirectosAsignados([
      {
        id: null,
        total_costo_directo: totalDirecto,
        administracion: admin,
        operacion: oper,
        utilidad: util,
        total: admin + oper + util,
      },
    ]);
  };

  const quitarIndirecto = () => setCostosIndirectosAsignados([]);

  const validate = () => {
    const er = {};
    if (!form.nombreServicio.trim()) er.nombreServicio = "El nombre es obligatorio.";
    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const er = validate();
    if (Object.keys(er).length > 0) {
      setErrors(er);
      return;
    }

    const totalDirectos = costosDirectosAsignados.reduce((acc, d) => acc + d.total, 0);
    const totalIndirectos = costosIndirectosAsignados.reduce((acc, ci) => acc + ci.total, 0);

    const saved = await onSubmit({
      id: form.id,
      nombreServicio: form.nombreServicio,
      descripcion: form.descripcion,
      totalCostoDirecto: totalDirectos,
      totalCostoIndirecto: totalIndirectos,
    });

    if (!saved) return;

    const servicioId = saved.id;

    for (const d of costosDirectosAsignados) {
      const payload = {
        servicio_id: servicioId,
        material_id: d.materialId,
        cantidad_material: d.cantidad_material,
        unidad_de_medida: d.unidad_de_medida,
        precio_unitario: d.precio_unitario,
      };

      if (d.id) await editDirecto(d.id, payload);
      else await addDirecto(payload);
    }

    for (const ci of costosIndirectosAsignados) {
      const payload = {
        servicio_id: servicioId,
        costo_directo_id: ci.costo_directo_id ?? 1,
        total_costo_directo: ci.total_costo_directo,
      };

      if (ci.id) await editIndirecto(ci.id, payload);
      else await addIndirecto(payload);
    }

    await reloadDirectos();
    await reloadIndirectos();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[100px] z-50">
      <form
        onSubmit={handleSubmit}
        className="
          bg-[#F9FAFB] rounded-2xl shadow-2xl
          w-full max-w-3xl
          p-8
          max-h-[90vh]
          overflow-y-auto
        "
      >
        <h2 className="text-2xl font-semibold text-[#1A2E81] mb-6 text-center">
          {isEdit ? "Editar Servicio" : "Nuevo Servicio"}
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Nombre del Servicio
            </label>
            <input
              type="text"
              name="nombreServicio"
              value={form.nombreServicio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {errors.nombreServicio && (
              <p className="text-red-600 text-sm">{errors.nombreServicio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-[#1A2E81] mt-6 mb-3">
          Costos Directos (Materiales)
        </h3>

        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar material..."
              value={busquedaMaterial}
              onChange={(e) => setBusquedaMaterial(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            {busquedaMaterial && (
              <select
                className="w-full border border-gray-300 rounded-md mt-2 p-2"
                value={materialSeleccionado}
                onChange={(e) => setMaterialSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar…</option>
                {materialesFiltrados.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre_material} — C${m.precio_unitario}
                  </option>
                ))}
              </select>
            )}

            {errors.asignarMaterial && (
              <p className="text-red-600 text-sm mt-1">{errors.asignarMaterial}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAsignarMaterial}
            className="px-6 bg-[#1A2E81] text-white rounded-md shadow-md hover:bg-[#213799]"
          >
            Asignar
          </button>
        </div>

        {costosDirectosAsignados.length > 0 && (
          <div className="bg-[#F9FAFB] rounded-lg p-4 shadow-inner border mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700 border-b">
                  <th className="p-2">Material</th>
                  <th className="p-2">Cant.</th>
                  <th className="p-2">U/M</th>
                  <th className="p-2">P.Unit</th>
                  <th className="p-2">Material</th>
                  <th className="p-2">Mano Obra</th>
                  <th className="p-2">Equipos</th>
                  <th className="p-2">Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {costosDirectosAsignados.map((d, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{d.nombre}</td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={d.cantidad_material}
                        onChange={(e) =>
                          actualizarDirecto(i, "cantidad_material", Number(e.target.value))
                        }
                        className="w-16 border rounded p-1"
                      />
                    </td>

                    <td className="p-2">{d.unidad_de_medida}</td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={d.precio_unitario}
                        onChange={(e) =>
                          actualizarDirecto(i, "precio_unitario", Number(e.target.value))
                        }
                        className="w-20 border rounded p-1"
                      />
                    </td>

                    <td className="p-2">C${d.costo_material.toLocaleString("es-NI")}</td>
                    <td className="p-2 text-blue-700 font-medium">
                      C${d.mano_obra.toLocaleString("es-NI")}
                    </td>
                    <td className="p-2 text-blue-700 font-medium">
                      C${d.equipos.toLocaleString("es-NI")}
                    </td>
                    <td className="p-2 font-bold text-green-700">
                      C${d.total.toLocaleString("es-NI")}
                    </td>

                    <td className="p-2">
                      <button
                        type="button"
                        onClick={() => quitarDirecto(d.materialId)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right font-bold text-lg mt-4 text-red-700">
              Total Directos: C$
              {costosDirectosAsignados
                .reduce((acc, d) => acc + d.total, 0)
                .toLocaleString("es-NI")}
            </div>
          </div>
        )}

        <h3 className="text-lg font-semibold text-[#1A2E81] mb-3">
          Costos Indirectos
        </h3>

        <button
          type="button"
          onClick={generarIndirectos}
          className="px-6 py-2 bg-[#F9FAFB] text-white rounded-md shadow-md hover:bg-[#213799] mb-3"
        >
          Generar Automáticamente
        </button>

        {costosIndirectosAsignados.length > 0 && (
          <div className="bg-white rounded-lg p-4 shadow-inner border mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200 text-gray-700 border-b">
                  <th className="p-2">C. Directo</th>
                  <th className="p-2">Admin</th>
                  <th className="p-2">Operación</th>
                  <th className="p-2">Utilidad</th>
                  <th className="p-2">Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {costosIndirectosAsignados.map((ci, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      C${ci.total_costo_directo.toLocaleString("es-NI")}
                    </td>
                    <td className="p-2">
                      C${ci.administracion.toLocaleString("es-NI")}
                    </td>
                    <td className="p-2">
                      C${ci.operacion.toLocaleString("es-NI")}
                    </td>
                    <td className="p-2">
                      C${ci.utilidad.toLocaleString("es-NI")}
                    </td>
                    <td className="p-2 font-bold text-blue-800">
                      C${ci.total.toLocaleString("es-NI")}
                    </td>

                    <td className="p-2">
                      <button
                        type="button"
                        onClick={quitarIndirecto}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            className="px-10 py-3 text-white rounded-md shadow-md"
            style={{ backgroundColor: "#1A2E81" }}
          >
            Guardar
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
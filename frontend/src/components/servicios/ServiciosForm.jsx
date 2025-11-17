import React, { useEffect, useState } from "react";

import { useMateriales } from "../../hooks/useMateriales";
import { useCostosDirectos } from "../../hooks/useCostosDirectos";
import { useCostosIndirectos } from "../../hooks/useCostosIndirectos";

export default function ServiciosForm({ onSubmit, onClose, initialData, isEdit }) {
  const { items: materiales } = useMateriales();
  const { items: directos, add: addDirecto, edit: editDirecto, reload: reloadDirectos } =
    useCostosDirectos();
  const {
    items: indirectos,
    add: addIndirecto,
    edit: editIndirecto,
    reload: reloadIndirectos,
  } = useCostosIndirectos();

  // ⭐ CAMBIO IMPORTANTE: nombreServicio
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

  // -------------------------
  // HANDLERS
  // -------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const materialesFiltrados = materiales.filter((m) =>
    m.nombre_material.toLowerCase().includes(busquedaMaterial.toLowerCase())
  );

  const handleAsignarMaterial = () => {
    if (!materialSeleccionado) return;

    const mat = materiales.find((m) => m.id === Number(materialSeleccionado));
    if (!mat) return;

    const repetido = costosDirectosAsignados.some((c) => c.materialId === mat.id);
    if (repetido) {
      alert("Este material ya está asignado.");
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

  const quitarDirecto = (materialId) =>
    setCostosDirectosAsignados((p) => p.filter((m) => m.materialId !== materialId));

  const agregarIndirectoDesdeDirectos = () => {
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

  // -------------------------
  // SUBMIT
  // -------------------------
const handleSubmit = async (e) => {
  e.preventDefault();

  const totalDirectos = costosDirectosAsignados.reduce(
    (acc, d) => acc + Number(d.total),
    0
  );

  const totalIndirectos = costosIndirectosAsignados.reduce(
    (acc, ci) => acc + Number(ci.total),
    0
  );

  // 🔥 MAPEADO CORRECTO PARA EL HOOK useServicios
  const servicioGuardado = await onSubmit({
    id: form.id,
    nombreServicio: form.nombreServicio,
    descripcion: form.descripcion,
    totalCostoDirecto: totalDirectos,
    totalCostoIndirecto: totalIndirectos,
  });

  if (!servicioGuardado) return;

  const servicioId = servicioGuardado.id;

  // ⇩ guardado de costos directos
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

  // ⇩ guardado de indirectos
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


  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[40px] z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-10 overflow-y-auto max-h-[90vh] border border-gray-200"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#1A2E81] tracking-wide">
          {isEdit ? "Editar Servicio" : "Nuevo Servicio"}
        </h2>

        {/* DATOS GENERALES */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="font-medium text-gray-800 text-sm">Nombre del Servicio</label>
            <input
              type="text"
              name="nombreServicio"
              value={form.nombreServicio}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
            />
          </div>

          <div>
            <label className="font-medium text-gray-800 text-sm">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
            />
          </div>
        </div>

        {/* COSTOS DIRECTOS */}
        <h3 className="text-xl font-semibold mt-10 mb-3 text-[#1A2E81]">
          Costos Directos (Materiales)
        </h3>

        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar material..."
              value={busquedaMaterial}
              onChange={(e) => setBusquedaMaterial(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm"
            />

            {busquedaMaterial && (
              <select
                className="w-full p-3 mt-2 border rounded-lg shadow-sm"
                value={materialSeleccionado}
                onChange={(e) => setMaterialSeleccionado(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {materialesFiltrados.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre_material} — C${m.precio_unitario}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            type="button"
            onClick={handleAsignarMaterial}
            className="px-6 bg-[#1A2E81] text-white rounded-lg hover:bg-[#213799] shadow-md"
          >
            Asignar
          </button>
        </div>

        {costosDirectosAsignados.length > 0 && (
          <div className="bg-gray-100 rounded-xl p-5 shadow-inner border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-200 text-gray-700">
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
                {costosDirectosAsignados.map((m, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{m.nombre}</td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={m.cantidad_material}
                        onChange={(e) =>
                          actualizarDirecto(i, "cantidad_material", Number(e.target.value))
                        }
                        className="w-16 border rounded p-1"
                      />
                    </td>

                    <td className="p-2">{m.unidad_de_medida}</td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={m.precio_unitario}
                        onChange={(e) =>
                          actualizarDirecto(i, "precio_unitario", Number(e.target.value))
                        }
                        className="w-20 border rounded p-1"
                      />
                    </td>

                    <td className="p-2">C${m.costo_material.toLocaleString("es-NI")}</td>

                    <td className="p-2 text-blue-700 font-medium">
                      C${m.mano_obra.toLocaleString("es-NI")}
                    </td>

                    <td className="p-2 text-blue-700 font-medium">
                      C${m.equipos.toLocaleString("es-NI")}
                    </td>

                    <td className="p-2 font-bold text-green-700">
                      C${m.total.toLocaleString("es-NI")}
                    </td>

                    <td className="p-2">
                      <button
                        type="button"
                        onClick={() => quitarDirecto(m.materialId)}
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

        {/* COSTOS INDIRECTOS */}
        <h3 className="text-xl font-semibold mt-12 mb-3 text-[#1A2E81]">
          Costos Indirectos
        </h3>

        <button
          type="button"
          onClick={agregarIndirectoDesdeDirectos}
          className="px-6 py-2 bg-[#1A2E81] text-white rounded-lg hover:bg-[#213799] shadow-md mb-3"
        >
          Generar Automáticamente
        </button>

        {costosIndirectosAsignados.length > 0 && (
          <div className="bg-gray-100 rounded-xl p-5 shadow-inner border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-200 text-gray-700">
                  <th className="p-2">Costo Directo</th>
                  <th className="p-2">Admin</th>
                  <th className="p-2">Operación</th>
                  <th className="p-2">Utilidad</th>
                  <th className="p-2">Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {costosIndirectosAsignados.map((ci, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
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

                    <td className="p-2 font-bold text-blue-700">
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

        {/* BOTONES */}
        <div className="flex justify-center gap-6 mt-12">
          <button
            type="submit"
            className="px-10 py-3 bg-[#1A2E81] text-white rounded-lg text-lg font-medium shadow-md hover:bg-[#213799]"
          >
            Guardar
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-10 py-3 bg-gray-300 text-gray-900 rounded-lg text-lg hover:bg-gray-400 shadow"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

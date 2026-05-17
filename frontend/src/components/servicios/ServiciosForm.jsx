import React, { useEffect, useState } from "react";
import { useMateriales } from "../../hooks/useMateriales";
import { useCostosDirectos } from "../../hooks/useCostosDirectos";
import { useCostosIndirectos } from "../../hooks/useCostosIndirectos";

export default function ServiciosForm({
  onSubmit,
  onClose,
  initialData,
  isEdit,
}) {
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

  const getMaterialNombre = (m) =>
    m.nombre_material ?? m.nombreMaterial ?? "";

  const getMaterialUnidad = (m) =>
    m.unidad_de_medida ?? m.unidadMedida ?? m.unidadDeMedida ?? "";

  const getMaterialPrecio = (m) =>
    Number(m.precio_unitario ?? m.precioUnitario ?? 0);

  const calcularDirecto = (cantidad, precio) => {
    const cantidadNum = Number(cantidad ?? 0);
    const precioNum = Number(precio ?? 0);

    const costoMaterial = cantidadNum * precioNum;
    const manoObra = costoMaterial * 0.4;
    const equipos = costoMaterial * 0.1;
    const total = costoMaterial + manoObra + equipos;

    return {
      costo_material: costoMaterial,
      mano_obra: manoObra,
      equipos,
      total,
    };
  };

  const calcularIndirecto = (totalDirecto) => {
    const total = Number(totalDirecto ?? 0);

    const administracion = total * 0.05;
    const operacion = total * 0.1;
    const utilidad = total * 0.15;
    const totalIndirecto = administracion + operacion + utilidad;

    return {
      total_costo_directo: total,
      administracion,
      operacion,
      utilidad,
      total: totalIndirecto,
    };
  };

  const recalcularIndirectosDesdeDirectos = (directosActualizados) => {
    const nuevoTotalDirecto = directosActualizados.reduce(
      (acc, d) => acc + Number(d.total ?? 0),
      0
    );

    setCostosIndirectosAsignados((prev) => {
      if (prev.length === 0) return prev;

      const calculado = calcularIndirecto(nuevoTotalDirecto);

      return prev.map((ci) => ({
        ...ci,
        ...calculado,
      }));
    });
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id ?? "",
        nombreServicio: initialData.nombreServicio ?? "",
        descripcion: initialData.descripcion ?? "",
      });

      setCostosDirectosAsignados(
        directos
          .filter((d) => Number(d.servicioId) === Number(initialData.id))
          .map((d) => ({
            id: d.id,
            materialId: d.materialId,
            nombre: d.materialNombre,
            cantidad_material: Number(d.cantidadMaterial ?? 0),
            unidad_de_medida: d.unidadMedida ?? "",
            precio_unitario: Number(d.precioUnitario ?? 0),
            costo_material: Number(d.costoMaterial ?? 0),
            mano_obra: Number(d.manoObra ?? 0),
            equipos: Number(d.equiposTransporteHerramientas ?? 0),
            total: Number(d.totalCostoDirecto ?? 0),
          }))
      );

      setCostosIndirectosAsignados(
        indirectos
          .filter((i) => Number(i.servicioId) === Number(initialData.id))
          .map((i) => ({
            id: i.id,
            costo_directo_id: i.costoDirectoId,
            total_costo_directo: Number(i.totalCostoDirecto ?? 0),
            administracion: Number(i.administracion ?? 0),
            operacion: Number(i.operacion ?? 0),
            utilidad: Number(i.utilidad ?? 0),
            total: Number(i.totalCostoIndirecto ?? 0),
          }))
      );
    } else {
      setForm({
        id: "",
        nombreServicio: "",
        descripcion: "",
      });

      setCostosDirectosAsignados([]);
      setCostosIndirectosAsignados([]);
    }
  }, [initialData, directos, indirectos]);

  const money = (value) =>
    Number(value ?? 0).toLocaleString("es-NI", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const totalDirectos = costosDirectosAsignados.reduce(
    (acc, d) => acc + Number(d.total ?? 0),
    0
  );

  const totalIndirectos = costosIndirectosAsignados.reduce(
    (acc, ci) => acc + Number(ci.total ?? 0),
    0
  );

  const totalServicio = totalDirectos + totalIndirectos;

  const materialesFiltrados = materiales.filter((m) =>
    getMaterialNombre(m)
      .toLowerCase()
      .includes(busquedaMaterial.toLowerCase())
  );

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-300 bg-slate-100 px-3 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-sm placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:px-4";

  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";
  const errorClass = "mt-1 text-sm font-medium text-red-600";

  const inputTableClass =
    "rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100";

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

    const existe = costosDirectosAsignados.some(
      (c) => Number(c.materialId) === Number(mat.id)
    );

    if (existe) {
      setErrors((prev) => ({
        ...prev,
        asignarMaterial: "Este material ya está asignado.",
      }));
      return;
    }

    const cantidad = 1;
    const precio = getMaterialPrecio(mat);

    const calculado = calcularDirecto(cantidad, precio);

    const nuevoItem = {
      id: null,
      materialId: mat.id,
      nombre: getMaterialNombre(mat),
      cantidad_material: cantidad,
      unidad_de_medida: getMaterialUnidad(mat),
      precio_unitario: precio,
      ...calculado,
    };

    setCostosDirectosAsignados((prev) => {
      const nuevos = [...prev, nuevoItem];
      recalcularIndirectosDesdeDirectos(nuevos);
      return nuevos;
    });

    setMaterialSeleccionado("");
    setBusquedaMaterial("");
    setErrors((prev) => ({ ...prev, asignarMaterial: "" }));
  };

  const actualizarDirecto = (index, campo, valor) => {
    setCostosDirectosAsignados((prev) => {
      const copia = [...prev];

      const item = {
        ...copia[index],
        [campo]: valor,
      };

      const calculado = calcularDirecto(
        item.cantidad_material,
        item.precio_unitario
      );

      copia[index] = {
        ...item,
        ...calculado,
      };

      recalcularIndirectosDesdeDirectos(copia);

      return copia;
    });
  };

  const quitarDirecto = (id) => {
    setCostosDirectosAsignados((prev) => {
      const nuevos = prev.filter((m) => Number(m.materialId) !== Number(id));
      recalcularIndirectosDesdeDirectos(nuevos);
      return nuevos;
    });
  };

  const generarIndirectos = () => {
    if (costosDirectosAsignados.length === 0) {
      setErrors((prev) => ({
        ...prev,
        asignarMaterial:
          "Debe asignar al menos un costo directo antes de generar indirectos.",
      }));
      return;
    }

    const calculado = calcularIndirecto(totalDirectos);

    setCostosIndirectosAsignados((prev) => [
      {
        id: prev[0]?.id ?? null,
        costo_directo_id: prev[0]?.costo_directo_id ?? null,
        ...calculado,
      },
    ]);
  };

  const quitarIndirecto = () => {
    setCostosIndirectosAsignados([]);
  };

  const validate = () => {
    const er = {};

    if (!form.nombreServicio.trim()) {
      er.nombreServicio = "El nombre es obligatorio.";
    }

    if (costosDirectosAsignados.length === 0) {
      er.asignarMaterial = "Debe asignar al menos un costo directo.";
    }

    const directoInvalido = costosDirectosAsignados.some(
      (d) =>
        Number(d.materialId) <= 0 ||
        Number(d.cantidad_material) <= 0 ||
        Number(d.precio_unitario) < 0 ||
        !d.unidad_de_medida
    );

    if (directoInvalido) {
      er.asignarMaterial =
        "Revise los costos directos. Cantidad, unidad y precio son obligatorios.";
    }

    return er;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const er = validate();

    if (Object.keys(er).length > 0) {
      setErrors(er);
      return;
    }

    try {
      const indirectoActualizado =
        costosIndirectosAsignados.length > 0
          ? calcularIndirecto(totalDirectos)
          : null;

      const totalIndirectoFinal = indirectoActualizado
        ? indirectoActualizado.total
        : 0;

      const saved = await onSubmit({
        id: form.id,
        nombreServicio: form.nombreServicio,
        descripcion: form.descripcion,
        totalCostoDirecto: Number(totalDirectos),
        totalCostoIndirecto: Number(totalIndirectoFinal),
      });

      if (!saved) return;

      const servicioId = saved.id;
      const costosDirectosGuardados = [];

      for (const d of costosDirectosAsignados) {
        const payload = {
          servicio_id: Number(servicioId),
          servicioId: Number(servicioId),

          material_id: Number(d.materialId),
          materialId: Number(d.materialId),

          cantidad_material: Number(d.cantidad_material ?? 0),
          cantidadMaterial: Number(d.cantidad_material ?? 0),

          unidad_de_medida: d.unidad_de_medida ?? "",
          unidadMedida: d.unidad_de_medida ?? "",

          precio_unitario: Number(d.precio_unitario ?? 0),
          precioUnitario: Number(d.precio_unitario ?? 0),
        };

        let directoGuardado;

        if (d.id) {
          directoGuardado = await editDirecto(d.id, payload);
        } else {
          directoGuardado = await addDirecto(payload);
        }

        costosDirectosGuardados.push(directoGuardado);
      }

      const primerCostoDirectoId =
        costosDirectosGuardados[0]?.id ??
        costosDirectosAsignados[0]?.id ??
        null;

      if (indirectoActualizado && !primerCostoDirectoId) {
        alert("No se pudo obtener el ID del costo directo.");
        return;
      }

      if (indirectoActualizado) {
        const indirectoBase = costosIndirectosAsignados[0];

        const payloadIndirecto = {
          servicio_id: Number(servicioId),
          servicioId: Number(servicioId),

          costo_directo_id: Number(
            indirectoBase?.costo_directo_id ??
              indirectoBase?.costoDirectoId ??
              primerCostoDirectoId
          ),
          costoDirectoId: Number(
            indirectoBase?.costo_directo_id ??
              indirectoBase?.costoDirectoId ??
              primerCostoDirectoId
          ),

          total_costo_directo: Number(totalDirectos),
          totalCostoDirecto: Number(totalDirectos),
        };

        if (indirectoBase?.id) {
          await editIndirecto(indirectoBase.id, payloadIndirecto);
        } else {
          await addIndirecto(payloadIndirecto);
        }
      }

      await reloadDirectos();
      await reloadIndirectos();
      onClose();
    } catch (error) {
      console.error("Error al guardar servicio con costos:", error);
      alert(error.message || "Error al guardar el servicio.");
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
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">
                Gestión de servicios
              </p>

              <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
                {isEdit ? "Editar Servicio" : "Nuevo Servicio"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SummaryBox label="Directos" value={`C$${money(totalDirectos)}`} />
              <SummaryBox
                label="Indirectos"
                value={`C$${money(totalIndirectos)}`}
              />
              <SummaryBox label="Total" value={`C$${money(totalServicio)}`} />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-slate-100 p-4 sm:p-6">
          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 border-b border-slate-300 pb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Información del servicio
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Complete los datos principales del servicio.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className={labelClass}>Nombre del Servicio</label>

                <input
                  type="text"
                  name="nombreServicio"
                  value={form.nombreServicio}
                  onChange={handleChange}
                  placeholder="Ejemplo: Albañilería básica"
                  className={inputClass}
                />

                {errors.nombreServicio && (
                  <p className={errorClass}>{errors.nombreServicio}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Descripción</label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Descripción breve del servicio"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-4 border-b border-slate-300 pb-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Costos directos
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Agregue materiales, cantidades y precios del servicio.
                </p>
              </div>

              <div className="w-full xl:max-w-xl">
                <label className={labelClass}>Buscar material</label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <input
                      type="text"
                      placeholder="Buscar material..."
                      value={busquedaMaterial}
                      onChange={(e) => setBusquedaMaterial(e.target.value)}
                      className={inputClass}
                    />

                    {busquedaMaterial && (
                      <select
                        className={`${inputClass} mt-3`}
                        value={materialSeleccionado}
                        onChange={(e) =>
                          setMaterialSeleccionado(e.target.value)
                        }
                      >
                        <option value="">Seleccionar material...</option>

                        {materialesFiltrados.map((m) => (
                          <option key={m.id} value={m.id}>
                            {getMaterialNombre(m)} — C$
                            {getMaterialPrecio(m).toLocaleString("es-NI", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
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
                    Asignar
                  </button>
                </div>
              </div>
            </div>

            {costosDirectosAsignados.length === 0 ? (
              <EmptyBox text="Aún no hay materiales asignados." />
            ) : (
              <>
                <div className="hidden overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-sm xl:block">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900 text-slate-100">
                      <tr>
                        <th className="px-4 py-4 text-left font-bold">
                          Material
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          Cant.
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          U/M
                        </th>
                        <th className="px-4 py-4 text-right font-bold">
                          P. Unit
                        </th>
                        <th className="px-4 py-4 text-right font-bold">
                          Material
                        </th>
                        <th className="px-4 py-4 text-right font-bold">
                          Mano Obra
                        </th>
                        <th className="px-4 py-4 text-right font-bold">
                          Equipos
                        </th>
                        <th className="px-4 py-4 text-right font-bold">
                          Total
                        </th>
                        <th className="px-4 py-4 text-center font-bold">
                          Acción
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-300">
                      {costosDirectosAsignados.map((d, i) => (
                        <tr
                          key={`${d.materialId}-${i}`}
                          className="bg-slate-100 transition hover:bg-blue-100"
                        >
                          <td className="px-4 py-4 font-bold text-slate-900">
                            {d.nombre}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={d.cantidad_material}
                              onChange={(e) =>
                                actualizarDirecto(
                                  i,
                                  "cantidad_material",
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
                              className={`w-24 text-center ${inputTableClass}`}
                            />
                          </td>

                          <td className="px-4 py-4 text-center text-slate-700">
                            {d.unidad_de_medida}
                          </td>

                          <td className="px-4 py-4 text-right">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={d.precio_unitario}
                              onChange={(e) =>
                                actualizarDirecto(
                                  i,
                                  "precio_unitario",
                                  e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                                )
                              }
                              className={`w-28 text-right ${inputTableClass}`}
                            />
                          </td>

                          <td className="px-4 py-4 text-right text-slate-700">
                            C${money(d.costo_material)}
                          </td>

                          <td className="px-4 py-4 text-right text-slate-700">
                            C${money(d.mano_obra)}
                          </td>

                          <td className="px-4 py-4 text-right text-slate-700">
                            C${money(d.equipos)}
                          </td>

                          <td className="px-4 py-4 text-right font-bold text-emerald-700">
                            C${money(d.total)}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => quitarDirecto(d.materialId)}
                              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                            >
                              Quitar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="border-t border-slate-300 bg-slate-200 p-4 text-right">
                    <p className="text-sm font-semibold text-slate-600">
                      Total Directos
                    </p>

                    <p className="text-sm font-bold text-blue-800">
                      C${money(totalDirectos)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 xl:hidden">
                  {costosDirectosAsignados.map((d, i) => (
                    <div
                      key={`${d.materialId}-${i}`}
                      className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
                    >
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {d.nombre}
                          </p>

                          <p className="text-sm text-slate-600">
                            Unidad: {d.unidad_de_medida}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => quitarDirecto(d.materialId)}
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
                            min="0"
                            step="0.01"
                            value={d.cantidad_material}
                            onChange={(e) =>
                              actualizarDirecto(
                                i,
                                "cantidad_material",
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
                            min="0"
                            step="0.01"
                            value={d.precio_unitario}
                            onChange={(e) =>
                              actualizarDirecto(
                                i,
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

                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <MiniBox
                          label="Costo Material"
                          value={`C$${money(d.costo_material)}`}
                        />

                        <MiniBox
                          label="Mano de Obra"
                          value={`C$${money(d.mano_obra)}`}
                        />

                        <MiniBox
                          label="Equipos"
                          value={`C$${money(d.equipos)}`}
                        />

                        <MiniBox
                          label="Total"
                          value={`C$${money(d.total)}`}
                          variant="green"
                        />
                      </div>
                    </div>
                  ))}

                  <InfoTotal
                    label="Total Directos"
                    value={`C$${money(totalDirectos)}`}
                  />
                </div>
              </>
            )}
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-4 border-b border-slate-300 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Costos indirectos
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Genere administración, operación y utilidad.
                </p>
              </div>

              <button
                type="button"
                onClick={generarIndirectos}
                className="
                  w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600
                  px-6 py-3 text-sm font-bold text-white shadow-lg
                  transition hover:scale-[1.01] hover:shadow-xl sm:w-auto
                "
              >
                Generar Automáticamente
              </button>
            </div>

            {costosIndirectosAsignados.length === 0 ? (
              <EmptyBox text="Aún no hay costos indirectos." />
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {costosIndirectosAsignados.map((ci, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-300 bg-slate-100 p-4"
                  >
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-bold text-slate-900">
                        Resumen de indirectos
                      </p>

                      <button
                        type="button"
                        onClick={quitarIndirecto}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                      >
                        Quitar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      <MiniBox
                        label="C. Directo"
                        value={`C$${money(ci.total_costo_directo)}`}
                      />

                      <MiniBox
                        label="Administración"
                        value={`C$${money(ci.administracion)}`}
                      />

                      <MiniBox
                        label="Operación"
                        value={`C$${money(ci.operacion)}`}
                      />

                      <MiniBox
                        label="Utilidad"
                        value={`C$${money(ci.utilidad)}`}
                      />

                      <MiniBox
                        label="Total"
                        value={`C$${money(ci.total)}`}
                        variant="green"
                      />
                    </div>
                  </div>
                ))}

                <InfoTotal
                  label="Total Indirectos"
                  value={`C$${money(totalIndirectos)}`}
                  green
                />
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
              {isEdit ? "Actualizar Servicio" : "Guardar Servicio"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const SummaryBox = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left shadow-sm backdrop-blur sm:text-right">
    <p className="text-sm font-medium text-cyan-100">{label}</p>
    <p className="mt-1 truncate text-sm font-bold text-white">{value}</p>
  </div>
);

const MiniBox = ({ label, value, variant = "default" }) => {
  const styles = {
    default: "border-slate-300 bg-slate-200 text-slate-800",
    green: "border-emerald-200 bg-emerald-100 text-emerald-800",
  };

  return (
    <div className={`rounded-xl border p-3 ${styles[variant]}`}>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
};

const InfoTotal = ({ label, value, green = false }) => (
  <div
    className={`
      rounded-2xl border px-5 py-4 text-right
      ${
        green
          ? "border-emerald-200 bg-emerald-100 text-emerald-800"
          : "border-blue-200 bg-blue-100 text-blue-800"
      }
    `}
  >
    <p className="text-sm font-semibold">{label}</p>
    <p className="text-sm font-bold">{value}</p>
  </div>
);

const EmptyBox = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-6 py-8 text-center">
    <p className="text-sm font-bold text-slate-700">{text}</p>
  </div>
);
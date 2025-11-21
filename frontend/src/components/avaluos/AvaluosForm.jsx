import React, { useEffect, useState } from "react";

import { useServicios } from "../../hooks/useServicios";
import { useDetallesAvaluos } from "../../hooks/useDetallesAvaluos";

export default function AvaluosForm({ onSubmit, onClose, initialData, isEdit }) {
  const { items: servicios } = useServicios();

  const {
    items: detalles,
    add: addDetalle,
    edit: editDetalle,
    remove: removeDetalle,
    reload: reloadDetalles,
  } = useDetallesAvaluos();

  // ===========================
  // ERRORES
  // ===========================
  const [errors, setErrors] = useState({});

  // ===========================
  // FORM AVALÚO
  // ===========================
  const [form, setForm] = useState({
    id: "",
    proyectoId: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [detallesAvaluos, setDetallesAvaluos] = useState([]);

  // ===========================
  // CARGAR INITIAL DATA
  // ===========================
  useEffect(() => {
    if (initialData) {
      const formatDate = (fecha) => {
        if (!fecha) return "";
        return new Date(fecha).toISOString().split("T")[0];
      };

      setForm({
        id: initialData.id,
        proyectoId: initialData.proyectoId,
        descripcion: initialData.descripcion,
        fechaInicio: formatDate(initialData.fechaInicio),
        fechaFin: formatDate(initialData.fechaFin),
      });

      const relacionados = detalles
        .filter((d) => Number(d.avaluoId) === Number(initialData.id))
        .map((d) => ({
          id: d.id,
          servicioId: d.servicioId,
          actividad: d.actividad,
          unidadMedida: d.unidadMedida,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
          costoVenta: d.costoVenta,
          iva: d.iva,
          total: d.totalCostoVenta,
        }));

      setDetallesAvaluos(relacionados);
    }
  }, [initialData, detalles]);

  // ===========================
  // HANDLE CHANGE
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    // limpiar error de ese campo
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ===========================
  // VALIDACIONES
  // ===========================
  const validate = () => {
    const newErrors = {};
    const fechaMin = new Date("2000-01-01");
    const fechaMax = new Date("2040-12-31");

    // fechaInicio
    if (!form.fechaInicio) {
      newErrors.fechaInicio = "Debe seleccionar la fecha de inicio.";
    } else {
      const fi = new Date(form.fechaInicio);
      if (fi < fechaMin || fi > fechaMax) {
        newErrors.fechaInicio = "La fecha debe estar entre 2000 y 2040.";
      }
    }

    // fechaFin
    if (!form.fechaFin) {
      newErrors.fechaFin = "Debe seleccionar la fecha fin.";
    } else {
      const ff = new Date(form.fechaFin);

      if (ff < fechaMin || ff > fechaMax) {
        newErrors.fechaFin = "La fecha debe estar entre 2000 y 2040.";
      }

      if (form.fechaInicio && ff < new Date(form.fechaInicio)) {
        newErrors.fechaFin = "La fecha fin no puede ser menor que la fecha inicio.";
      }
    }

    return newErrors;
  };

  // ===========================
  // AGREGAR SERVICIO
  // ===========================
  const agregarServicio = (servicioId) => {
    const serv = servicios.find((s) => s.id === Number(servicioId));
    if (!serv) return;

    const repetido = detallesAvaluos.some((d) => d.servicioId === serv.id);
    if (repetido) {
      alert("Este servicio ya está asignado al avalúo.");
      return;
    }

    const precio = Number(serv.costoVenta);
    const iva = precio * 0.15;
    const total = precio + iva;

    setDetallesAvaluos((prev) => [
      ...prev,
      {
        id: null,
        servicioId: serv.id,
        actividad: serv.nombreServicio,
        unidadMedida: "UND",
        cantidad: 1,
        precioUnitario: precio,
        costoVenta: precio,
        iva,
        total,
      },
    ]);
  };

  // ===========================
  // ACTUALIZAR DETALLE
  // ===========================
  const actualizarDetalle = (index, campo, valor) => {
    setDetallesAvaluos((prev) => {
      const copia = [...prev];
      const item = { ...copia[index], [campo]: valor };

      const base = Number(item.cantidad) * Number(item.precioUnitario);
      item.costoVenta = base;
      item.iva = base * 0.15;
      item.total = base + item.iva;

      copia[index] = item;
      return copia;
    });
  };

  // ===========================
  // QUITAR DETALLE
  // ===========================
  const quitarDetalle = async (detalle) => {
    if (detalle.id) {
      await removeDetalle(detalle.id);
      await reloadDetalles();
    }

    setDetallesAvaluos((prev) =>
      prev.filter((d) => d.servicioId !== detalle.servicioId)
    );
  };

  // ===========================
  // SUBMIT FINAL
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // correr validaciones
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // detener guardado
    }

    const totalAvaluo = detallesAvaluos.reduce(
      (acc, d) => acc + Number(d.total),
      0
    );

    // guardar avalúo
    const avaluoGuardado = await onSubmit({
      id: form.id,
      proyectoId: form.proyectoId,
      descripcion: form.descripcion,
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      totalAvaluo,
    });

    if (!avaluoGuardado) return;

    const avaluoId = avaluoGuardado.id;

    // guardar detalles
    for (const d of detallesAvaluos) {
      const payload = {
        avaluoId,
        servicioId: d.servicioId,
        actividad: d.actividad,
        unidadMedida: d.unidadMedida,
        cantidad: Number(d.cantidad),
      };

      if (d.id) await editDetalle(d.id, payload);
      else await addDetalle(payload);
    }

    await reloadDetalles();
    onClose();
  };

  // ===========================
  // UI COMPLETA (sin eliminar nada)
  // ===========================
  return (
    <div className="fixed inset-0 flex justify-center items-start mt-[40px] z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-10 overflow-y-auto max-h-[90vh] border border-gray-200"
      >
        <h2 className="text-3xl font-semibold text-center mb-6 text-[#1A2E81] tracking-wide">
          {isEdit ? "Editar Avalúo" : "Nuevo Avalúo"}
        </h2>

        {/* DATOS GENERALES */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          <div>
            <label className="font-medium text-gray-800 text-sm">
              Proyecto ID
            </label>
            <input
              type="number"
              name="proyectoId"
              value={form.proyectoId}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
            />
          </div>

          <div>
            <label className="font-medium text-gray-800 text-sm">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
            />
          </div>

          {/* === FECHA INICIO === */}
          <div>
            <label className="font-medium text-gray-800 text-sm">
              Fecha Inicio
            </label>
            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
            />
            {errors.fechaInicio && (
              <p className="text-red-600 text-sm mt-1">{errors.fechaInicio}</p>
            )}
          </div>

          {/* === FECHA FIN === */}
          <div>
            <label className="font-medium text-gray-800 text-sm">
              Fecha Fin
            </label>
            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-[#1A2E81]"
            />
            {errors.fechaFin && (
              <p className="text-red-600 text-sm mt-1">{errors.fechaFin}</p>
            )}
          </div>
        </div>

        {/* AGREGAR SERVICIO */}
        <h3 className="text-xl font-semibold mt-10 mb-3 text-[#1A2E81]">
          Agregar Servicios al Avalúo
        </h3>

        <select
          className="p-3 border rounded-lg shadow-sm w-72"
          onChange={(e) => agregarServicio(e.target.value)}
        >
          <option value="">Seleccionar servicio...</option>
          {servicios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombreServicio} — C${s.costoVenta}
            </option>
          ))}
        </select>

        {/* TABLA DETALLES */}
        {detallesAvaluos.length > 0 && (
          <div className="bg-gray-100 rounded-xl p-5 shadow-inner border mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-200 text-gray-700">
                  <th className="p-2">Servicio</th>
                  <th className="p-2">Cant.</th>
                  <th className="p-2">U/M</th>
                  <th className="p-2">P.Unit</th>
                  <th className="p-2">Costo</th>
                  <th className="p-2">IVA</th>
                  <th className="p-2">Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {detallesAvaluos.map((d, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">{d.actividad}</td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={d.cantidad}
                        onChange={(e) =>
                          actualizarDetalle(i, "cantidad", Number(e.target.value))
                        }
                        className="w-16 border rounded p-1"
                      />
                    </td>

                    <td className="p-2">{d.unidadMedida}</td>

                    <td className="p-2">
                      <input
                        type="number"
                        value={d.precioUnitario}
                        onChange={(e) =>
                          actualizarDetalle(i, "precioUnitario", Number(e.target.value))
                        }
                        className="w-20 border rounded p-1"
                      />
                    </td>

                    <td className="p-2">
                      C${d.costoVenta.toLocaleString("es-NI")}
                    </td>

                    <td className="p-2">
                      C${d.iva.toLocaleString("es-NI")}
                    </td>

                    <td className="p-2 font-bold text-green-700">
                      C${d.total.toLocaleString("es-NI")}
                    </td>

                    <td className="p-2">
                      <button
                        type="button"
                        onClick={() => quitarDetalle(d)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-right font-bold text-lg mt-4 text-blue-800">
              Total Avalúo: C$
              {detallesAvaluos
                .reduce((acc, d) => acc + d.total, 0)
                .toLocaleString("es-NI")}
            </div>
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

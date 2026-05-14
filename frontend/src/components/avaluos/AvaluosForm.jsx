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

  const [errors, setErrors] = useState({});
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    id: "",
    proyectoId: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [detallesAvaluos, setDetallesAvaluos] = useState([]);

  useEffect(() => {
    if (initialData) {
      const formatDate = (f) =>
        f ? new Date(f).toISOString().split("T")[0] : "";

      setForm({
        id: initialData.id ?? "",
        proyectoId: initialData.proyectoId ?? "",
        descripcion: initialData.descripcion ?? "",
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
          cantidad: Number(d.cantidad),
          precioUnitario: Number(d.precioUnitario),
          costoVenta: Number(d.costoVenta),
          iva: Number(d.iva),
          total: Number(d.totalCostoVenta),
        }));

      setDetallesAvaluos(relacionados);
    } else {
      setForm({
        id: "",
        proyectoId: "",
        descripcion: "",
        fechaInicio: "",
        fechaFin: "",
      });

      setDetallesAvaluos([]);
    }
  }, [initialData, detalles]);

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

    const min = new Date("2000-01-01");
    const max = new Date("2040-12-31");

    const fi = new Date(form.fechaInicio);
    const ff = new Date(form.fechaFin);

    if (!String(form.proyectoId).trim()) {
      newErrors.proyectoId = "Debe ingresar el ID del proyecto.";
    }

    if (!form.fechaInicio) {
      newErrors.fechaInicio = "Debe seleccionar la fecha inicio.";
    } else if (fi < min || fi > max) {
      newErrors.fechaInicio = "Debe estar entre los años 2000 y 2040.";
    }

    if (!form.fechaFin) {
      newErrors.fechaFin = "Debe seleccionar la fecha fin.";
    } else {
      if (ff < min || ff > max) {
        newErrors.fechaFin = "Debe estar entre los años 2000 y 2040.";
      }

      if (form.fechaInicio && ff < fi) {
        newErrors.fechaFin = "No puede ser menor que la fecha inicio.";
      }
    }

    return newErrors;
  };

  const agregarServicio = (id) => {
    if (!id) return;

    const serv = servicios.find((s) => Number(s.id) === Number(id));

    if (!serv) return;

    if (detallesAvaluos.some((d) => Number(d.servicioId) === Number(serv.id))) {
      alert("Este servicio ya está agregado.");
      return;
    }

    const precio = Number(serv.costoVenta ?? 0);
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

  const actualizarDetalle = (index, campo, valor) => {
    setDetallesAvaluos((prev) => {
      const copia = [...prev];

      const item = {
        ...copia[index],
        [campo]: valor,
      };

      const cantidad = Number(item.cantidad ?? 0);
      const precioUnitario = Number(item.precioUnitario ?? 0);

      const base = cantidad * precioUnitario;

      item.costoVenta = base;
      item.iva = base * 0.15;
      item.total = base + item.iva;

      copia[index] = item;

      return copia;
    });
  };

  const quitarDetalle = async (detalle) => {
    try {
      if (detalle.id) {
        await removeDetalle(detalle.id);
        await reloadDetalles();
      }

      setDetallesAvaluos((prev) =>
        prev.filter(
          (x) => Number(x.servicioId) !== Number(detalle.servicioId)
        )
      );
    } catch (error) {
      console.error("Error al quitar detalle:", error);
      alert(error.message || "No se pudo quitar el detalle.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (guardando) return;

    try {
      setGuardando(true);

      const newErrors = validate();

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const totalAvaluo = detallesAvaluos.reduce(
        (acc, d) => acc + Number(d.total ?? 0),
        0
      );

      const saved = await onSubmit({
        ...form,
        proyectoId: Number(form.proyectoId),
        totalAvaluo,
      });

      if (!saved || !saved.id) {
        alert("No se pudo guardar el avalúo correctamente.");
        return;
      }

      for (const detalle of detallesAvaluos) {
        const payload = {
          avaluoId: saved.id,
          servicioId: detalle.servicioId,
          actividad: detalle.actividad,
          unidadMedida: detalle.unidadMedida,
          cantidad: Number(detalle.cantidad),
        };

        if (detalle.id) {
          await editDetalle(detalle.id, payload);
        } else {
          await addDetalle(payload);
        }
      }

      await reloadDetalles();
      onClose();
    } catch (error) {
      console.error("Error al guardar avalúo:", error);
      alert(error.message || "Ocurrió un error al guardar el avalúo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-20 z-50 flex justify-center items-center p-8">
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
        <h2 className="text-2xl font-semibold text-[#1A2E81] mb-4 text-center">
          {isEdit ? "Editar Avalúo" : "Nuevo Avalúo"}
        </h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Proyecto ID
            </label>

            <input
              type="number"
              name="proyectoId"
              value={form.proyectoId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            {errors.proyectoId && (
              <p className="text-red-600 text-sm">{errors.proyectoId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha Inicio
            </label>

            <input
              type="date"
              name="fechaInicio"
              value={form.fechaInicio}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            {errors.fechaInicio && (
              <p className="text-red-600 text-sm">{errors.fechaInicio}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha Fin
            </label>

            <input
              type="date"
              name="fechaFin"
              value={form.fechaFin}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />

            {errors.fechaFin && (
              <p className="text-red-600 text-sm">{errors.fechaFin}</p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-300 pt-4">
          <h3 className="text-lg font-semibold text-[#1A2E81] mb-3">
            Servicios del Avalúo
          </h3>

          <select
            className="border p-2 rounded-md w-72"
            value=""
            onChange={(e) => agregarServicio(e.target.value)}
          >
            <option value="">Seleccionar servicio...</option>

            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombreServicio} — C$
                {Number(s.costoVenta ?? 0).toLocaleString("es-NI")}
              </option>
            ))}
          </select>

          {detallesAvaluos.length > 0 && (
            <div className="bg-[#F9FAFB] rounded-lg p-4 mt-4 shadow-inner border overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 border-b">
                    <th className="p-2">Servicio</th>
                    <th className="p-2">Cant.</th>
                    <th className="p-2">U/M</th>
                    <th className="p-2">P.Unit</th>
                    <th className="p-2">Costo</th>
                    <th className="p-2">IVA</th>
                    <th className="p-2">Total</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>

                <tbody>
                  {detallesAvaluos.map((d, i) => (
                    <tr
                      key={`${d.servicioId}-${i}`}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-2">{d.actividad}</td>

                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={d.cantidad}
                          onChange={(e) =>
                            actualizarDetalle(
                              i,
                              "cantidad",
                              Number(e.target.value)
                            )
                          }
                          className="w-16 border rounded p-1"
                        />
                      </td>

                      <td className="p-2">{d.unidadMedida}</td>

                      <td className="p-2">
                        <input
                          type="number"
                          value={d.precioUnitario}
                          disabled
                          className="w-24 border rounded p-1 bg-gray-100"
                        />
                      </td>

                      <td className="p-2">
                        C$
                        {Number(d.costoVenta ?? 0).toLocaleString("es-NI")}
                      </td>

                      <td className="p-2">
                        C${Number(d.iva ?? 0).toLocaleString("es-NI")}
                      </td>

                      <td className="p-2 font-bold text-green-700">
                        C${Number(d.total ?? 0).toLocaleString("es-NI")}
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
                  .reduce((acc, d) => acc + Number(d.total ?? 0), 0)
                  .toLocaleString("es-NI")}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-6 mt-10">
          <button
            type="submit"
            disabled={guardando}
            className={`text-white px-7 py-3 rounded-md ${
              guardando ? "opacity-60 cursor-not-allowed" : ""
            }`}
            style={{ backgroundColor: "#1A2E81" }}
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="bg-gray-300 text-gray-900 px-7 py-3 rounded-md"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
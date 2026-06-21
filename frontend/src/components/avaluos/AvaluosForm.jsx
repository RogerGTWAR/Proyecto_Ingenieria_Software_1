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

  const [modalError, setModalError] = useState({
    open: false,
    title: "",
    message: "",
  });

  const mostrarError = (title, message) => {
    setModalError({
      open: true,
      title,
      message,
    });
  };

  const cerrarError = () => {
    setModalError({
      open: false,
      title: "",
      message: "",
    });
  };

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

  const money = (value) => Number(value ?? 0).toLocaleString("es-NI");

  const totalGeneral = detallesAvaluos.reduce(
    (acc, d) => acc + Number(d.total ?? 0),
    0
  );

  const totalServicios = detallesAvaluos.length;

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

    if (detallesAvaluos.length === 0) {
      newErrors.servicios = "Debe agregar al menos un servicio al avalúo.";
    }

    return newErrors;
  };

  const agregarServicio = (id) => {
    if (!id) return;

    const serv = servicios.find((s) => Number(s.id) === Number(id));

    if (!serv) return;

    if (detallesAvaluos.some((d) => Number(d.servicioId) === Number(serv.id))) {
      setErrors((prev) => ({
        ...prev,
        servicios: "Este servicio ya está agregado.",
      }));
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

    setErrors((prev) => ({
      ...prev,
      servicios: "",
    }));
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
        prev.filter((x) => Number(x.servicioId) !== Number(detalle.servicioId))
      );
    } catch (error) {
      mostrarError(
        "Error al quitar servicio",
        error.message || "No se pudo quitar el detalle del avalúo."
      );
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

      if (isEdit && initialData?.id) {
        for (const detalle of detallesAvaluos) {
          const payload = {
            avaluoId: initialData.id,
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

        const saved = await onSubmit({
          ...form,
          proyectoId: Number(form.proyectoId),
          totalAvaluo: totalGeneral,
        });

        if (!saved || !saved.id) {
          throw new Error("No se pudo actualizar el avalúo correctamente.");
        }

        await reloadDetalles();
        onClose();
        return;
      }

      const saved = await onSubmit({
        ...form,
        proyectoId: Number(form.proyectoId),
        totalAvaluo: totalGeneral,
      });

      if (!saved || !saved.id) {
        throw new Error("No se pudo guardar el avalúo correctamente.");
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
      mostrarError(
        error.message?.includes("Stock insuficiente")
          ? "Inventario insuficiente"
          : "Error al guardar avalúo",
        error.message || "Ocurrió un error al guardar el avalúo."
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
            <div className="min-w-0">
              <p className="text-sm font-medium text-cyan-100">
                Gestión de avalúos
              </p>

              <h2 className="mt-1 text-sm font-bold tracking-tight text-white">
                {isEdit ? "Editar Avalúo" : "Nuevo Avalúo"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SummaryBox label="Servicios" value={totalServicios} />

              <SummaryBox
                label="Total actual"
                value={`C$${money(totalGeneral)}`}
              />
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
                Complete los datos principales del avalúo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="min-w-0">
                <label className={labelClass}>Proyecto ID</label>

                <input
                  type="number"
                  name="proyectoId"
                  value={form.proyectoId}
                  onChange={handleChange}
                  placeholder="Ejemplo: 1"
                  className={inputClass}
                />

                {errors.proyectoId && (
                  <p className={errorClass}>{errors.proyectoId}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Descripción</label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Descripción breve del avalúo"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Fecha Inicio</label>

                <input
                  type="date"
                  name="fechaInicio"
                  value={form.fechaInicio}
                  onChange={handleChange}
                  className={inputClass}
                />

                {errors.fechaInicio && (
                  <p className={errorClass}>{errors.fechaInicio}</p>
                )}
              </div>

              <div className="min-w-0">
                <label className={labelClass}>Fecha Fin</label>

                <input
                  type="date"
                  name="fechaFin"
                  value={form.fechaFin}
                  onChange={handleChange}
                  className={inputClass}
                />

                {errors.fechaFin && (
                  <p className={errorClass}>{errors.fechaFin}</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-300 bg-slate-200 p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-4 border-b border-slate-300 pb-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Servicios del avalúo
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Agregue los servicios que forman parte del avalúo.
                </p>
              </div>

              <div className="w-full xl:max-w-xl">
                <label className={labelClass}>Agregar servicio</label>

                <select
                  className={inputClass}
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

                {errors.servicios && (
                  <p className={errorClass}>{errors.servicios}</p>
                )}
              </div>
            </div>

            {detallesAvaluos.length === 0 ? (
              <EmptyBox text="Aún no hay servicios agregados." />
            ) : (
              <>
                <div className="hidden overflow-hidden rounded-3xl border border-slate-300 bg-slate-100 shadow-sm xl:block">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900 text-slate-100">
                      <tr>
                        <th className="px-4 py-4 text-left font-bold">
                          Servicio
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
                          Costo
                        </th>
                        <th className="px-4 py-4 text-right font-bold">
                          IVA
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
                      {detallesAvaluos.map((d, i) => (
                        <tr
                          key={`${d.servicioId}-${i}`}
                          className="bg-slate-100 transition hover:bg-blue-100"
                        >
                          <td className="px-4 py-4 font-bold text-slate-900">
                            {d.actividad}
                          </td>

                          <td className="px-4 py-4 text-center">
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
                              className="w-20 rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-center text-sm outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100"
                            />
                          </td>

                          <td className="px-4 py-4 text-center text-slate-700">
                            {d.unidadMedida}
                          </td>

                          <td className="px-4 py-4 text-right text-slate-700">
                            C${money(d.precioUnitario)}
                          </td>

                          <td className="px-4 py-4 text-right text-slate-700">
                            C${money(d.costoVenta)}
                          </td>

                          <td className="px-4 py-4 text-right text-slate-700">
                            C${money(d.iva)}
                          </td>

                          <td className="px-4 py-4 text-right font-bold text-emerald-700">
                            C${money(d.total)}
                          </td>

                          <td className="px-4 py-4 text-center">
                            <button
                              type="button"
                              onClick={() => quitarDetalle(d)}
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
                      Total Avalúo
                    </p>

                    <p className="text-sm font-bold text-emerald-800">
                      C${money(totalGeneral)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 xl:hidden">
                  {detallesAvaluos.map((d, i) => (
                    <div
                      key={`${d.servicioId}-${i}`}
                      className="rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm"
                    >
                      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {d.actividad}
                          </p>

                          <p className="text-sm text-slate-600">
                            Unidad: {d.unidadMedida}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => quitarDetalle(d)}
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
                            min="1"
                            value={d.cantidad}
                            onChange={(e) =>
                              actualizarDetalle(
                                i,
                                "cantidad",
                                Number(e.target.value)
                              )
                            }
                            className={inputClass}
                          />
                        </div>

                        <MiniBox
                          label="Precio Unitario"
                          value={`C$${money(d.precioUnitario)}`}
                        />

                        <MiniBox label="Costo" value={`C$${money(d.costoVenta)}`} />

                        <MiniBox label="IVA" value={`C$${money(d.iva)}`} />

                        <MiniBox
                          label="Total"
                          value={`C$${money(d.total)}`}
                          variant="green"
                        />
                      </div>
                    </div>
                  ))}

                  <InfoTotal
                    label="Total Avalúo"
                    value={`C$${money(totalGeneral)}`}
                  />
                </div>
              </>
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
                ? "Actualizar Avalúo"
                : "Guardar Avalúo"}
            </button>
          </div>
        </div>
      </form>

      {modalError.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-red-200 bg-white shadow-2xl">
            <div className="px-6 py-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-2xl font-black text-red-600">
                  !
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black text-slate-900">
                    {modalError.title}
                  </h3>

                  <p className="mt-2 whitespace-pre-line text-sm font-medium leading-relaxed text-slate-600">
                    {modalError.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={cerrarError}
                className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-700"
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

const InfoTotal = ({ label, value }) => (
  <div className="rounded-2xl border border-emerald-200 bg-emerald-100 px-5 py-4 text-right text-emerald-800">
    <p className="text-sm font-semibold">{label}</p>
    <p className="text-sm font-bold">{value}</p>
  </div>
);

const EmptyBox = ({ text }) => (
  <div className="rounded-2xl border border-dashed border-slate-400 bg-slate-100 px-6 py-8 text-center">
    <p className="text-sm font-bold text-slate-700">{text}</p>
  </div>
);
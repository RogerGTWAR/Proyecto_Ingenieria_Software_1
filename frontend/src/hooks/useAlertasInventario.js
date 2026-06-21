import { useEffect, useMemo, useState } from "react";
import {
  fetchHistorialAlertas,
  marcarAlertaLeida,
  marcarTodasAlertasLeidas,
  eliminarAlerta,
} from "../data/historialAlertas.js";

export function useHistorialAlertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarAlertas = async () => {
    try {
      setError("");

      const data = await fetchHistorialAlertas();
      setAlertas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las alertas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlertas();

    const interval = setInterval(() => {
      cargarAlertas();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const noLeidas = useMemo(() => {
    return alertas.filter((a) => !a.leida).length;
  }, [alertas]);

  const marcarLeida = async (id) => {
    await marcarAlertaLeida(id);

    setAlertas((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              leida: true,
            }
          : a
      )
    );
  };

  const marcarTodas = async () => {
    await marcarTodasAlertasLeidas();

    setAlertas((prev) =>
      prev.map((a) => ({
        ...a,
        leida: true,
      }))
    );
  };

  const eliminar = async (id) => {
    await eliminarAlerta(id);

    setAlertas((prev) => prev.filter((a) => a.id !== id));
  };

  return {
    alertas,
    loading,
    error,
    noLeidas,
    cargarAlertas,
    marcarLeida,
    marcarTodas,
    eliminar,
  };
}
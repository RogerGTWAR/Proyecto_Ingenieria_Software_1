import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import AvaluoRoutes from "./routes/AvaluoRoutes.js";
import AvaluoServicioRoutes from "./routes/AvaluoServicioRoutes.js";
import CategoriaRoutes from "./routes/CategoriaRoutes.js";
import CategoriasProveedorRoutes from "./routes/CategoriasProveedorRoutes.js";
import ClienteRoutes from "./routes/ClienteRoutes.js";
import CompraRoutes from "./routes/CompraRoutes.js";
import DetalleCompraRoutes from "./routes/DetalleCompraRoutes.js";
import DetalleEmpleadoRoutes from "./routes/DetalleEmpleadoRoutes.js";
import DetalleMaquinariaRoutes from "./routes/DetalleMaquinariaRoutes.js";
import DetalleServicioRoutes from "./routes/DetalleServicioRoutes.js";
import DetalleVehiculoRoutes from "./routes/DetalleVehiculoRoutes.js";
import EmpleadoRoutes from "./routes/EmpleadoRoutes.js";
import MaquinariaRoutes from "./routes/MaquinariaRoutes.js";
import ProductoRoutes from "./routes/ProductoRoutes.js";
import ProveedorRoutes from "./routes/ProveedorRoutes.js";
import ProyectoRoutes from "./routes/ProyectoRoutes.js";
import RolRoutes from "./routes/RolRoutes.js";
import ServicioRoutes from "./routes/ServicioRoutes.js";
import VehiculoRoutes from "./routes/VehiculoRoutes.js";

dotenv.config();

const app = express();

app.use(express.json({
  limit: "10mb",
  type: () => true,
}));

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(cookieParser());

app.use(express.static("public"));
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/api/avaluo", AvaluoRoutes);
app.use("/api/avaluo_servicio", AvaluoServicioRoutes);
app.use("/api/categoria", CategoriaRoutes);
app.use("/api/categorias_proveedor", CategoriasProveedorRoutes);
app.use("/api/cliente", ClienteRoutes);
app.use("/api/compra", CompraRoutes);
app.use("/api/detalle_compra", DetalleCompraRoutes);
app.use("/api/detalle_empleado", DetalleEmpleadoRoutes);
app.use("/api/detalle_maquinaria", DetalleMaquinariaRoutes);
app.use("/api/detalle_servicio", DetalleServicioRoutes);
app.use("/api/detalle_vehiculo", DetalleVehiculoRoutes);
app.use("/api/empleado", EmpleadoRoutes);
app.use("/api/maquinaria", MaquinariaRoutes);
app.use("/api/producto", ProductoRoutes);
app.use("/api/proveedor", ProveedorRoutes);
app.use("/api/proyecto", ProyectoRoutes);
app.use("/api/rol", RolRoutes);
app.use("/api/servicio", ServicioRoutes);
app.use("/api/vehiculo", VehiculoRoutes);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    msg: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ ok: false, msg: "Error interno del servidor" });
});

export default app;

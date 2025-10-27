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

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

const allowedOrigins = [
  "https://frontend-u5xi.onrender.com", 
  "http://localhost:5173",            
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("Bloqueado por CORS:", origin);
        callback(new Error("No permitido por CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.static("public"));
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    msg: "API funcionando correctamente en Render",
  });
});

app.use("/api/avaluos", AvaluoRoutes);
app.use("/api/avaluo_servicios", AvaluoServicioRoutes);
app.use("/api/categorias", CategoriaRoutes);
app.use("/api/categorias_proveedores", CategoriasProveedorRoutes);
app.use("/api/clientes", ClienteRoutes);
app.use("/api/compras", CompraRoutes);
app.use("/api/detalle_compras", DetalleCompraRoutes);
app.use("/api/detalle_empleados", DetalleEmpleadoRoutes);
app.use("/api/detalle_maquinarias", DetalleMaquinariaRoutes);
app.use("/api/detalle_servicios", DetalleServicioRoutes);
app.use("/api/detalle_vehiculos", DetalleVehiculoRoutes);
app.use("/api/empleados", EmpleadoRoutes);
app.use("/api/maquinarias", MaquinariaRoutes);
app.use("/api/productos", ProductoRoutes);
app.use("/api/proveedores", ProveedorRoutes);
app.use("/api/proyectos", ProyectoRoutes);
app.use("/api/roles", RolRoutes);
app.use("/api/servicios", ServicioRoutes);
app.use("/api/vehiculos", VehiculoRoutes);

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

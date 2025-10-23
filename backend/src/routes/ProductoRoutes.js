//Listo
import express from "express";
import ProductosController from "../controllers/ProductosController.js";

const productoRouter = express.Router();

productoRouter.get("/", ProductosController.getAll);
productoRouter.get("/:id", ProductosController.getById);
productoRouter.post("/", ProductosController.create);
productoRouter.patch("/:id", ProductosController.update);
productoRouter.delete("/:id", ProductosController.delete);

export default productoRouter;

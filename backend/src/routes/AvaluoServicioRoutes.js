//Falta-En Revision
import express from "express";
import AvaluosServiciosController from "../controllers/AvaluosServiciosController.js";

const avaluoServicioRouter = express.Router();

avaluoServicioRouter.get("/", AvaluosServiciosController.getAll);
avaluoServicioRouter.get("/:id", AvaluosServiciosController.getById);
avaluoServicioRouter.post("/", AvaluosServiciosController.create);
avaluoServicioRouter.patch("/:id", AvaluosServiciosController.update);
avaluoServicioRouter.delete("/:id", AvaluosServiciosController.delete);

export default avaluoServicioRouter;

import { Router } from "express";
import PermisosController from "../controllers/PermisosController.js";

const router = Router();

router.get("/menu", PermisosController.getMenuAll);
router.get("/:usuarioId", PermisosController.getPermisosByUsuario);
router.get("/no-asignados/:usuarioId", PermisosController.getMenuSinAsignar);
router.post("/asignar", PermisosController.asignar);
router.post("/remover", PermisosController.remover);

export default router;

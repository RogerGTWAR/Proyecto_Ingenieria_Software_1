// routes/AuthRoutes.js
import { Router } from "express";

import {
  register,
  login,
  me,
  logout,
  autoRegister,
  forgotPassword,
  resetPassword,
  getAllUsuarios,
  getUsuarioById
} from "../controllers/authController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

/* =============================
      LOGIN & REGISTER
   ============================= */
router.post("/register", register);
router.post("/login", login);

/* =============================
      SESIÓN Y PERFIL
   ============================= */
router.get("/me", authMiddleware, me);
router.post("/logout", authMiddleware, logout);

/* =============================
      AUTO CREAR USUARIO
   ============================= */
router.post("/auto-register", authMiddleware, autoRegister);

/* =============================
      RECUPERAR CONTRASEÑA
   ============================= */
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* =============================
      GET ALL / GET BY ID
   ============================= */
router.get("/usuarios", authMiddleware, getAllUsuarios);
router.get("/usuarios/:id", authMiddleware, getUsuarioById);

export default router;

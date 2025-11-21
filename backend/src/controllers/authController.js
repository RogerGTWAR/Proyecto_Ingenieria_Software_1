// controllers/authController.js
import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { signToken, verifyToken } from "../config/jwt.js";
import Mailer from "../utils/Mailer.js";

const SALT = 10;

/* ============================================================
   Helpers
   ============================================================ */
const sendError = (res, status, msg) =>
  res.status(status).json({ ok: false, msg });

const sanitizeUser = (u) => ({
  usuario_id: u.usuario_id,
  usuario: u.usuario,
  empleado_id: u.empleado_id,
});

/* ============================================================
   1. LOGIN
   ============================================================ */
export const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena)
    return sendError(res, 400, "Usuario y contraseña son requeridos");

  try {
    const query = `
      SELECT usuario_id, usuario, contrasena, empleado_id 
      FROM usuarios 
      WHERE usuario = $1 AND fecha_eliminacion IS NULL
    `;

    const result = await pool.query(query, [usuario]);

    if (result.rowCount === 0) return sendError(res, 401, "Credenciales incorrectas");

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) return sendError(res, 401, "Credenciales incorrectas");

    const token = signToken({
      usuario_id: user.usuario_id,
      empleado_id: user.empleado_id,
      usuario: user.usuario,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8, // 8 horas
    });

    return res.json({
      ok: true,
      msg: "Login exitoso",
      usuario: sanitizeUser(user),
    });

  } catch (error) {
    console.error("[LOGIN ERROR]:", error);
    return sendError(res, 500, "Error interno");
  }
};

/* ============================================================
   2. REGISTRO NORMAL
   ============================================================ */
export const register = async (req, res) => {
  const { empleado_id, usuario, contrasena } = req.body;

  // Validación inicial
  if (!empleado_id || !usuario || !contrasena)
    return sendError(res, 400, "empleado_id, usuario y contrasena son requeridos");

  try {
    // Verificar empleado
    const empCheck = await pool.query(
      "SELECT 1 FROM empleados WHERE empleado_id = $1 AND fecha_eliminacion IS NULL",
      [empleado_id]
    );
    if (empCheck.rowCount === 0) return sendError(res, 404, "Empleado no existe");

    // Verificar si empleado ya tiene usuario
    const userByEmp = await pool.query(
      "SELECT 1 FROM usuarios WHERE empleado_id = $1 AND fecha_eliminacion IS NULL",
      [empleado_id]
    );
    if (userByEmp.rowCount > 0)
      return sendError(res, 400, "Ese empleado ya tiene usuario");

    // Verificar si usuario ya existe
    const userByName = await pool.query(
      "SELECT 1 FROM usuarios WHERE usuario = $1",
      [usuario]
    );
    if (userByName.rowCount > 0)
      return sendError(res, 400, "Ese nombre de usuario ya existe");

    const hash = await bcrypt.hash(contrasena, SALT);

    const insert = await pool.query(
      `INSERT INTO usuarios (empleado_id, usuario, contrasena)
       VALUES ($1, $2, $3)
       RETURNING usuario_id, usuario, empleado_id, fecha_creacion`,
      [empleado_id, usuario, hash]
    );

    return res.json({
      ok: true,
      msg: "Usuario creado correctamente",
      usuario: insert.rows[0],
    });

  } catch (error) {
    console.error("[REGISTER ERROR]:", error);
    return sendError(res, 500, "Error interno");
  }
};

/* ============================================================
   3. AUTO-REGISTER (Profesional)
   ============================================================ */
export const autoRegister = async (req, res) => {
  const { empleado_id } = req.body;

  if (!empleado_id) return sendError(res, 400, "empleado_id requerido");

  try {
    const emp = await pool.query(
      "SELECT nombres, apellidos, correo FROM empleados WHERE empleado_id = $1",
      [empleado_id]
    );

    if (emp.rowCount === 0)
      return sendError(res, 404, "Empleado no encontrado");

    const exists = await pool.query(
      `SELECT 1 FROM usuarios 
       WHERE empleado_id = $1 
       AND fecha_eliminacion IS NULL`,
      [empleado_id]
    );

    if (exists.rowCount > 0)
      return sendError(res, 400, "El empleado ya tiene una cuenta");

    const empleado = emp.rows[0];

    const suggestedUser = empleado.correo
      ? empleado.correo.split("@")[0]
      : `${empleado.nombres.split(" ")[0].toLowerCase()}.${empleado.apellidos
          .split(" ")[0]
          .toLowerCase()}`;

    const randomPassword = Math.random().toString(36).slice(-8);

    const hash = await bcrypt.hash(randomPassword, SALT);

    const nuevo = await pool.query(
      `INSERT INTO usuarios (empleado_id, usuario, contrasena)
       VALUES ($1, $2, $3)
       RETURNING usuario_id, usuario`,
      [empleado_id, suggestedUser, hash]
    );

    return res.json({
      ok: true,
      msg: "Cuenta creada automáticamente",
      usuario: nuevo.rows[0],
      password_generada: randomPassword,
    });

  } catch (error) {
    console.error("[AUTO_REGISTER ERROR]:", error);
    return sendError(res, 500, "Error interno");
  }
};

/* ============================================================
   4. FORGOT PASSWORD
   ============================================================ */
export const forgotPassword = async (req, res) => {
  const { usuario } = req.body;

  if (!usuario) return sendError(res, 400, "usuario requerido");

  try {
    const result = await pool.query(
      "SELECT usuario_id FROM usuarios WHERE usuario = $1",
      [usuario]
    );

    if (result.rowCount === 0)
      return sendError(res, 404, "Usuario no encontrado");

    const token = signToken({ usuario_id: result.rows[0].usuario_id });

    const link = `${process.env.FRONTEND_URL}/recuperar?token=${token}`;

    await Mailer.sendMail({
      to: usuario,
      subject: "Restablecer contraseña",
      html: `
        <p>Has solicitado cambiar tu contraseña.</p>
        <p><a href="${link}">Haz clic aquí para continuar</a></p>
      `,
    });

    return res.json({ ok: true, msg: "Correo enviado" });

  } catch (error) {
    console.error("[FORGOT ERROR]:", error);
    return sendError(res, 500, "Error interno");
  }
};

/* ============================================================
   5. RESET PASSWORD
   ============================================================ */
export const resetPassword = async (req, res) => {
  const { token, contrasena } = req.body;

  if (!token || !contrasena)
    return sendError(res, 400, "token y contrasena requeridos");

  try {
    const data = verifyToken(token);

    const hash = await bcrypt.hash(contrasena, SALT);

    await pool.query(
      "UPDATE usuarios SET contrasena = $1 WHERE usuario_id = $2",
      [hash, data.usuario_id]
    );

    return res.json({ ok: true, msg: "Contraseña actualizada" });

  } catch (error) {
    return sendError(res, 400, "Token inválido o expirado");
  }
};

/* ============================================================
   6. ME
   ============================================================ */
export const me = (req, res) => {
  return res.json({ ok: true, user: req.user });
};

/* ============================================================
   7. LOGOUT
   ============================================================ */
export const logout = (req, res) => {
  res.clearCookie("token");
  return res.json({ ok: true, msg: "Sesión cerrada" });
};

/* ============================================================
   8. GET ALL USUARIOS
   ============================================================ */
export const getAllUsuarios = async (_req, res) => {
  try {
    const query = `
      SELECT u.usuario_id, u.usuario, u.empleado_id, 
             e.nombres, e.apellidos, e.rol_id
      FROM usuarios u
      INNER JOIN empleados e ON e.empleado_id = u.empleado_id
      WHERE u.fecha_eliminacion IS NULL
      ORDER BY u.usuario_id DESC
    `;

    const result = await pool.query(query);

    return res.json({ ok: true, usuarios: result.rows });

  } catch (error) {
    console.error("[GET ALL ERROR]:", error);
    return sendError(res, 500, "Error interno");
  }
};

/* ============================================================
   9. GET USUARIO BY ID
   ============================================================ */
export const getUsuarioById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT u.usuario_id, u.usuario, u.empleado_id, 
             e.nombres, e.apellidos, e.rol_id
      FROM usuarios u
      INNER JOIN empleados e ON e.empleado_id = u.empleado_id
      WHERE u.usuario_id = $1 AND u.fecha_eliminacion IS NULL
    `;

    const result = await pool.query(query, [id]);

    if (result.rowCount === 0)
      return sendError(res, 404, "Usuario no encontrado");

    return res.json({ ok: true, usuario: result.rows[0] });

  } catch (error) {
    console.error("[GET BY ID ERROR]:", error);
    return sendError(res, 500, "Error interno");
  }
};

-- ============================================================
-- REGISTROS INICIALES PARA INICIO DE SESIÓN
-- SISTEMA ACONSA
-- PostgreSQL
-- ============================================================

BEGIN;

-- ============================================================
-- 1. EXTENSIÓN PARA ENCRIPTAR CONTRASEÑAS
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- 2. ROL ADMINISTRADOR
-- ============================================================

INSERT INTO public.roles (
    cargo,
    descripcion,
    fecha_creacion
)
SELECT
    'Administrador General',
    'Responsable de la gestión total del sistema, con acceso completo a todos los módulos.',
    NOW()
WHERE NOT EXISTS (
    SELECT 1
    FROM public.roles
    WHERE cargo = 'Administrador General'
);

-- ============================================================
-- 3. EMPLEADO ADMINISTRADOR
-- Teléfono: solo números
-- Cédula: sin guiones
-- ============================================================

INSERT INTO public.empleados (
    nombres,
    apellidos,
    cedula,
    rol_id,
    fecha_nacimiento,
    fecha_contratacion,
    direccion,
    pais,
    telefono,
    correo,
    reportes,
    fecha_creacion
)
SELECT
    'Administrador',
    'General',
    '0000000000000A',
    r.rol_id,
    '1998-01-01',
    CURRENT_DATE,
    'San Carlos, Río San Juan',
    'Nicaragua',
    '00000000',
    'admin@aconsa.com',
    NULL,
    NOW()
FROM public.roles r
WHERE r.cargo = 'Administrador General'
AND NOT EXISTS (
    SELECT 1
    FROM public.empleados
    WHERE cedula = '0000000000000A'
);

-- ============================================================
-- 4. CORREGIR EMPLEADO ADMIN SI YA EXISTÍA CON GUIONES
-- ============================================================

UPDATE public.empleados
SET
    cedula = '0000000000000A',
    telefono = '00000000',
    correo = 'admin@aconsa.com',
    fecha_actualizacion = NOW()
WHERE cedula = '000-000000-0000A'
OR correo = 'admin@aconsa.com';

-- ============================================================
-- 5. USUARIO ADMINISTRADOR
-- Usuario: admin
-- Contraseña: Admin123*
-- ============================================================

INSERT INTO public.usuarios (
    empleado_id,
    usuario,
    contrasena,
    fecha_creacion
)
SELECT
    e.empleado_id,
    'admin',
    crypt('Admin123*', gen_salt('bf', 10)),
    NOW()
FROM public.empleados e
WHERE e.cedula = '0000000000000A'
AND NOT EXISTS (
    SELECT 1
    FROM public.usuarios
    WHERE usuario = 'admin'
);

-- ============================================================
-- 6. MENÚS PRINCIPALES
-- Los ID son autoincrementables.
-- ============================================================

-- ============================================================
-- MENÚ: INICIO
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Inicio',
    FALSE,
    '/',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Inicio'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Inicio';

-- ============================================================
-- MENÚ: DASHBOARD
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Dashboard',
    FALSE,
    '/dashboard',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Dashboard'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/dashboard',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Dashboard';

-- ============================================================
-- MENÚ: REGISTRO
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Registro',
    FALSE,
    NULL,
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Registro'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = NULL,
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Registro';

-- ============================================================
-- MENÚ: PROYECTOS
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Proyectos',
    FALSE,
    '/proyectos',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Proyectos'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/proyectos',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Proyectos';

-- ============================================================
-- MENÚ: VEHÍCULOS
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Vehículos',
    FALSE,
    '/vehiculos',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Vehículos'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/vehiculos',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Vehículos';

-- ============================================================
-- MENÚ: COMPRAS
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Compras',
    FALSE,
    '/compras',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Compras'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/compras',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Compras';

-- ============================================================
-- MENÚ: MATERIALES
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Materiales',
    FALSE,
    '/materiales',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Materiales'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/materiales',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Materiales';

-- ============================================================
-- MENÚ: SERVICIOS
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Servicios',
    FALSE,
    '/servicios',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Servicios'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/servicios',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Servicios';

-- ============================================================
-- MENÚ: MENU
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Menu',
    FALSE,
    '/menus',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Menu'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/menus',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Menu';

-- ============================================================
-- MENÚ: AVALUO
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Avaluo',
    FALSE,
    '/avaluos',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Avaluo'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/avaluos',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Avaluo';

-- ============================================================
-- MENÚ: MOVIMIENTOS
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Movimientos',
    FALSE,
    '/movimientos_inventario',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Movimientos'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/movimientos_inventario',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Movimientos';

-- ============================================================
-- MENÚ: NOTIFICACIONES
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Notificaciones',
    FALSE,
    '/notificaciones',
    NULL,
    TRUE,
    TRUE
WHERE NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Notificaciones'
);

UPDATE public.menu
SET
    es_submenu = FALSE,
    url = '/notificaciones',
    id_menu_parent = NULL,
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Notificaciones';

-- ============================================================
-- 7. SUBMENÚS DENTRO DE REGISTRO
-- Se toma automáticamente el ID del menú padre Registro.
-- ============================================================

-- ============================================================
-- SUBMENÚ: EMPLEADOS
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Empleados',
    TRUE,
    '/empleados',
    r.id_menu,
    TRUE,
    TRUE
FROM public.menu r
WHERE r.nombre = 'Registro'
AND NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Empleados'
);

UPDATE public.menu
SET
    es_submenu = TRUE,
    url = '/empleados',
    id_menu_parent = (
        SELECT id_menu
        FROM public.menu
        WHERE nombre = 'Registro'
        LIMIT 1
    ),
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Empleados';

-- ============================================================
-- SUBMENÚ: CLIENTES
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Clientes',
    TRUE,
    '/clientes',
    r.id_menu,
    TRUE,
    TRUE
FROM public.menu r
WHERE r.nombre = 'Registro'
AND NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Clientes'
);

UPDATE public.menu
SET
    es_submenu = TRUE,
    url = '/clientes',
    id_menu_parent = (
        SELECT id_menu
        FROM public.menu
        WHERE nombre = 'Registro'
        LIMIT 1
    ),
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Clientes';

-- ============================================================
-- SUBMENÚ: PROVEEDORES
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Proveedores',
    TRUE,
    '/proveedores',
    r.id_menu,
    TRUE,
    TRUE
FROM public.menu r
WHERE r.nombre = 'Registro'
AND NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Proveedores'
);

UPDATE public.menu
SET
    es_submenu = TRUE,
    url = '/proveedores',
    id_menu_parent = (
        SELECT id_menu
        FROM public.menu
        WHERE nombre = 'Registro'
        LIMIT 1
    ),
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Proveedores';

-- ============================================================
-- SUBMENÚ: PERMISOS
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Permisos',
    TRUE,
    '/permisos',
    r.id_menu,
    TRUE,
    TRUE
FROM public.menu r
WHERE r.nombre = 'Registro'
AND NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Permisos'
);

UPDATE public.menu
SET
    es_submenu = TRUE,
    url = '/permisos',
    id_menu_parent = (
        SELECT id_menu
        FROM public.menu
        WHERE nombre = 'Registro'
        LIMIT 1
    ),
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Permisos';

-- ============================================================
-- SUBMENÚ: USUARIOS
-- ============================================================

INSERT INTO public.menu (
    nombre,
    es_submenu,
    url,
    id_menu_parent,
    estado,
    show
)
SELECT
    'Usuarios',
    TRUE,
    '/usuarios',
    r.id_menu,
    TRUE,
    TRUE
FROM public.menu r
WHERE r.nombre = 'Registro'
AND NOT EXISTS (
    SELECT 1
    FROM public.menu
    WHERE nombre = 'Usuarios'
);

UPDATE public.menu
SET
    es_submenu = TRUE,
    url = '/usuarios',
    id_menu_parent = (
        SELECT id_menu
        FROM public.menu
        WHERE nombre = 'Registro'
        LIMIT 1
    ),
    estado = TRUE,
    show = TRUE
WHERE nombre = 'Usuarios';

-- ============================================================
-- 8. PERMISOS COMPLETOS PARA EL USUARIO ADMINISTRADOR
-- Aquí se agregan TODOS los menús, incluyendo:
-- Movimientos y Notificaciones.
-- ============================================================

INSERT INTO public.permisos (
    usuario_id,
    id_menu,
    estado,
    fecha_creacion
)
SELECT
    u.usuario_id,
    m.id_menu,
    TRUE,
    NOW()
FROM public.usuarios u
CROSS JOIN public.menu m
WHERE u.usuario = 'admin'
AND m.estado = TRUE
AND NOT EXISTS (
    SELECT 1
    FROM public.permisos p
    WHERE p.usuario_id = u.usuario_id
    AND p.id_menu = m.id_menu
);

-- ============================================================
-- 9. REACTIVAR PERMISOS DEL ADMIN SI YA EXISTÍAN INACTIVOS
-- ============================================================

UPDATE public.permisos p
SET
    estado = TRUE,
    fecha_actualizacion = NOW()
FROM public.usuarios u
WHERE p.usuario_id = u.usuario_id
AND u.usuario = 'admin';

COMMIT;

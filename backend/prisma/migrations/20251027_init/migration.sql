
-- ROLES
CREATE TABLE roles (
  rol_id              SERIAL PRIMARY KEY,
  cargo               VARCHAR(100),
  descripcion         VARCHAR(150),
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ
);

-- EMPLEADOS
CREATE TABLE empleados (
  empleado_id         SERIAL PRIMARY KEY,
  nombres             VARCHAR(100) NOT NULL,
  apellidos           VARCHAR(100) NOT NULL,
  cedula              VARCHAR(25) NOT NULL,
  rol_id              INT NOT NULL,
  fecha_nacimiento    DATE NOT NULL,
  fecha_contratacion  DATE NOT NULL,
  direccion           VARCHAR(150),
  pais                VARCHAR(50),
  telefono            VARCHAR(15),
  correo              VARCHAR(100),
  reportes            INT,
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_empleados_rol FOREIGN KEY (rol_id)
    REFERENCES roles (rol_id),

  CONSTRAINT fk_empleados_jefe FOREIGN KEY (reportes)
    REFERENCES empleados (empleado_id)
);

-- CLIENTES
CREATE TABLE clientes (
  cliente_id          CHAR(5) PRIMARY KEY,
  nombre_empresa      VARCHAR(100) NOT NULL,
  nombre_contacto     VARCHAR(100),
  cargo_contacto      VARCHAR(50),
  direccion           VARCHAR(150),
  ciudad              VARCHAR(100),
  pais                VARCHAR(50),
  telefono            VARCHAR(20),
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ
);

-- CATEGORÍAS PROVEEDOR
CREATE TABLE categorias_proveedor (
  categoria_proveedor_id SERIAL PRIMARY KEY,
  nombre_categoria       VARCHAR(100) NOT NULL,
  descripcion            VARCHAR(150),
  fecha_creacion         TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion    TIMESTAMPTZ,
  fecha_eliminacion      TIMESTAMPTZ
);

-- PROVEEDORES
CREATE TABLE proveedores (
  proveedor_id           SERIAL PRIMARY KEY,
  categoria_proveedor_id INT NOT NULL,
  nombre_empresa         VARCHAR(100) NOT NULL,
  nombre_contacto        VARCHAR(100),
  cargo_contacto         VARCHAR(50),
  direccion              VARCHAR(150),
  ciudad                 VARCHAR(100),
  pais                   VARCHAR(50),
  telefono               VARCHAR(15),
  correo                 VARCHAR(100),
  fecha_creacion         TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion    TIMESTAMPTZ,
  fecha_eliminacion      TIMESTAMPTZ,

  CONSTRAINT fk_proveedores_categoria
    FOREIGN KEY (categoria_proveedor_id)
    REFERENCES categorias_proveedor (categoria_proveedor_id)
);

-- CATEGORÍAS
CREATE TABLE categorias (
  categoria_id        SERIAL PRIMARY KEY,
  nombre_categoria    VARCHAR(100) NOT NULL,
  descripcion         VARCHAR(150) NOT NULL,
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ
);

-- MATERIALES
CREATE TABLE materiales (
  material_id         SERIAL PRIMARY KEY,
  nombre_material     VARCHAR(100) NOT NULL,
  categoria_id        INT,
  descripcion         VARCHAR(150),
  unidad_de_medida    VARCHAR(100) NOT NULL,
  cantidad_en_stock   INT NOT NULL,
  precio_unitario     NUMERIC(18,2) NOT NULL CHECK (precio_unitario >= 0),
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_materiales_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias (categoria_id)
);

-- PROYECTOS
CREATE TABLE proyectos (
  proyecto_id         SERIAL PRIMARY KEY,
  cliente_id          CHAR(5) NOT NULL,
  nombre_proyecto     VARCHAR(100) NOT NULL,
  descripcion         VARCHAR(150),
  ubicacion           VARCHAR(100),
  fecha_inicio        DATE NOT NULL,
  fecha_fin           DATE,
  tiempo_total_dias   INT GENERATED ALWAYS AS ((fecha_fin - fecha_inicio)) STORED,
  presupuesto_total   NUMERIC(18,2) NOT NULL CHECK (presupuesto_total >= 0),
  estado              VARCHAR(50) NOT NULL CHECK (estado IN ('En Espera','Activo','Completado','Cancelado')),
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_proyectos_cliente FOREIGN KEY (cliente_id)
    REFERENCES clientes (cliente_id)
);

-- DETALLES EMPLEADOS
CREATE TABLE detalles_empleados (
  detalle_empleado_id SERIAL,
  empleado_id         INT NOT NULL,
  proyecto_id         INT NOT NULL,
  fecha_de_proyecto   DATE,
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,
  PRIMARY KEY (detalle_empleado_id, empleado_id, proyecto_id),

  CONSTRAINT fk_detalle_empleado FOREIGN KEY (empleado_id)
    REFERENCES empleados (empleado_id),

  CONSTRAINT fk_detalle_proyecto FOREIGN KEY (proyecto_id)
    REFERENCES proyectos (proyecto_id)
);

-- AVALUOS
CREATE TABLE avaluos (
  avaluo_id           SERIAL PRIMARY KEY,
  proyecto_id         INT NOT NULL,
  descripcion         VARCHAR(200),
  monto_ejecutado     NUMERIC(18,2) NOT NULL CHECK (monto_ejecutado >= 0),
  fecha_inicio        TIMESTAMPTZ NOT NULL,
  fecha_fin           TIMESTAMPTZ NOT NULL,
  tiempo_total_dias   INT GENERATED ALWAYS AS ((fecha_fin::date - fecha_inicio::date)) STORED,
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_avaluo_proyecto FOREIGN KEY (proyecto_id)
    REFERENCES proyectos (proyecto_id)
);

-- SERVICIOS
CREATE TABLE servicios (
  servicio_id         SERIAL PRIMARY KEY,
  nombre_servicio     VARCHAR(100) NOT NULL,
  descripcion         VARCHAR(200),
  total_costo_directo   NUMERIC(18,2) NOT NULL,
  total_costo_indirecto NUMERIC(18,2) NOT NULL,

  costo_venta NUMERIC(18,2)
      GENERATED ALWAYS AS (total_costo_directo + total_costo_indirecto) STORED,

  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ
);

-- COSTOS DIRECTOS SERVICIOS
CREATE TABLE costos_directos_servicios (
  costo_directo_id SERIAL PRIMARY KEY,
  servicio_id       INT NOT NULL,
  material_id       INT NOT NULL,
  cantidad_material INT NOT NULL,
  unidad_de_medida  VARCHAR(50) NOT NULL,
  precio_unitario   NUMERIC(18,2) NOT NULL,

  costo_material NUMERIC(18,2)
      GENERATED ALWAYS AS (precio_unitario * cantidad_material) STORED,

  mano_obra NUMERIC(18,2)
      GENERATED ALWAYS AS ((precio_unitario * cantidad_material) * 0.40) STORED,

  equipos_transporte_herramientas NUMERIC(18,2)
      GENERATED ALWAYS AS ((precio_unitario * cantidad_material) * 0.10) STORED,

  total_costo_directo NUMERIC(18,2)
      GENERATED ALWAYS AS (
        (precio_unitario * cantidad_material) +
        ((precio_unitario * cantidad_material) * 0.40) +
        ((precio_unitario * cantidad_material) * 0.10)
      ) STORED,

  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_eliminacion TIMESTAMPTZ,

  CONSTRAINT fk_cds_serv FOREIGN KEY (servicio_id)
      REFERENCES servicios (servicio_id),

  CONSTRAINT fk_cds_mat FOREIGN KEY (material_id)
      REFERENCES materiales (material_id)
);

-- COSTOS INDIRECTOS SERVICIOS
CREATE TABLE costos_indirectos_servicios (
  costo_indirecto_id   SERIAL PRIMARY KEY,
  servicio_id          INT NOT NULL,
  costo_directo_id     INT NOT NULL,
  total_costo_directo  NUMERIC(18,2) NOT NULL,

  administracion NUMERIC(18,2)
      GENERATED ALWAYS AS (total_costo_directo * 0.05) STORED,

  operacion NUMERIC(18,2)
      GENERATED ALWAYS AS (total_costo_directo * 0.10) STORED,

  utilidad NUMERIC(18,2)
      GENERATED ALWAYS AS (total_costo_directo * 0.15) STORED,

  precio_unitario NUMERIC(18,2)
      GENERATED ALWAYS AS (
        (total_costo_directo * 0.05) +
        (total_costo_directo * 0.10) +
        (total_costo_directo * 0.15)
      ) STORED,

  total_costo_indirecto NUMERIC(18,2)
      GENERATED ALWAYS AS (
        (total_costo_directo * 0.05) +
        (total_costo_directo * 0.10) +
        (total_costo_directo * 0.15)
      ) STORED,

  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion TIMESTAMPTZ,

  CONSTRAINT fk_cis_serv FOREIGN KEY (servicio_id)
      REFERENCES servicios (servicio_id),

  CONSTRAINT fk_cis_cd FOREIGN KEY (costo_directo_id)
      REFERENCES costos_directos_servicios (costo_directo_id)
);

-- MAQUINARIAS
CREATE TABLE maquinarias (
  maquinaria_id       SERIAL PRIMARY KEY,
  proveedor_id        INT,
  nombre_maquinaria   VARCHAR(100) NOT NULL,
  marca               VARCHAR(50),
  modelo              VARCHAR(50),
  precio_por_hora     NUMERIC(18,2) NOT NULL CHECK (precio_por_hora >= 0),
  descripcion         VARCHAR(200),
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_maq_prov FOREIGN KEY (proveedor_id)
    REFERENCES proveedores (proveedor_id)
);

-- DETALLES MAQUINARIAS
CREATE TABLE detalles_maquinarias (
  detalle_maquinaria_id SERIAL,
  proyecto_id           INT,
  maquinaria_id         INT,
  horas_utilizadas      INT,
  fecha_inicio_renta    DATE NOT NULL,
  fecha_fin_renta       DATE,
  estado                VARCHAR(30),
  fecha_creacion        TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion   TIMESTAMPTZ,
  fecha_eliminacion    TIMESTAMPTZ,
  PRIMARY KEY (detalle_maquinaria_id, proyecto_id, maquinaria_id),

  CONSTRAINT fk_dm_proy FOREIGN KEY (proyecto_id)
      REFERENCES proyectos (proyecto_id),

  CONSTRAINT fk_dm_maq FOREIGN KEY (maquinaria_id)
      REFERENCES maquinarias (maquinaria_id)
);

-- VEHÍCULOS
CREATE TABLE vehiculos (
  vehiculo_id         SERIAL PRIMARY KEY,
  proveedor_id        INT,
  marca               VARCHAR(50) NOT NULL,
  modelo              VARCHAR(50) NOT NULL,
  anio                INT NOT NULL,
  placa               VARCHAR(15) UNIQUE NOT NULL,
  tipo_de_vehiculo    VARCHAR(30),
  tipo_de_combustible VARCHAR(40),
  estado              VARCHAR(20),
  fecha_registro      DATE,
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_veh_prov FOREIGN KEY (proveedor_id)
    REFERENCES proveedores (proveedor_id)
);

-- DETALLES VEHÍCULOS
CREATE TABLE detalles_vehiculos (
  detalle_vehiculo_id  SERIAL,
  empleado_id          INT NOT NULL,
  vehiculo_id          INT NOT NULL,
  fecha_asignacion     DATE NOT NULL,
  fecha_fin_asignacion DATE,
  descripcion          VARCHAR(100),
  fecha_creacion       TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion  TIMESTAMPTZ,
  fecha_eliminacion    TIMESTAMPTZ,
  PRIMARY KEY (detalle_vehiculo_id, empleado_id, vehiculo_id),

  CONSTRAINT fk_dv_emp FOREIGN KEY (empleado_id)
      REFERENCES empleados (empleado_id),

  CONSTRAINT fk_dv_veh FOREIGN KEY (vehiculo_id)
      REFERENCES vehiculos (vehiculo_id)
);

-- USUARIOS
CREATE TABLE usuarios (
  usuario_id          SERIAL PRIMARY KEY,
  empleado_id         INT NOT NULL,
  usuario             VARCHAR(100) NOT NULL,
  contrasena          VARCHAR(200) NOT NULL,
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_usuario_empleado FOREIGN KEY (empleado_id)
    REFERENCES empleados (empleado_id)
);

-- COMPRAS
CREATE TABLE compras (
  compra_id           SERIAL PRIMARY KEY,
  proveedor_id        INT NOT NULL,
  empleado_id         INT,
  numero_factura      VARCHAR(50) NOT NULL,
  fecha_compra        DATE NOT NULL DEFAULT CURRENT_DATE,
  monto_total         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (monto_total >= 0),
  estado              VARCHAR(50) NOT NULL,
  observaciones       VARCHAR(200),
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_comp_prov FOREIGN KEY (proveedor_id)
      REFERENCES proveedores (proveedor_id),

  CONSTRAINT fk_comp_emp FOREIGN KEY (empleado_id)
      REFERENCES empleados (empleado_id)
);

-- DETALLES COMPRAS
CREATE TABLE detalles_compras (
  detalle_compra_id   SERIAL PRIMARY KEY,
  compra_id           INT NOT NULL,
  material_id         INT NOT NULL,
  cantidad            INT NOT NULL CHECK (cantidad > 0),
  precio_unitario     NUMERIC(18,2) NOT NULL CHECK (precio_unitario >= 0),

  subtotal NUMERIC(18,2)
      GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,

  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_dc_comp FOREIGN KEY (compra_id)
      REFERENCES compras (compra_id),

  CONSTRAINT fk_dc_mat FOREIGN KEY (material_id)
      REFERENCES materiales (material_id)
);

-- DETALLES AVALUOS
CREATE TABLE detalles_avaluos (
  detalle_avaluo_id     SERIAL,
  avaluo_id             INT NOT NULL,
  servicio_id           INT NOT NULL,
  actividad             VARCHAR(100) NOT NULL,
  unidad_de_medida      VARCHAR(50) NOT NULL,
  cantidad              INT NOT NULL CHECK (cantidad > 0),
  precio_unitario       NUMERIC(18,2) NOT NULL CHECK (precio_unitario >= 0),

  costo_venta NUMERIC(18,2)
      GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,

  iva NUMERIC(18,2)
      GENERATED ALWAYS AS ((cantidad * precio_unitario) * 0.15) STORED,

  total_costo_venta NUMERIC(18,2)
      GENERATED ALWAYS AS (
        (cantidad * precio_unitario) +
        ((cantidad * precio_unitario) * 0.15)
      ) STORED,

  observaciones VARCHAR(200),
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  PRIMARY KEY (detalle_avaluo_id, avaluo_id, servicio_id),

  CONSTRAINT fk_da_avaluo FOREIGN KEY (avaluo_id)
      REFERENCES avaluos (avaluo_id),

  CONSTRAINT fk_da_serv FOREIGN KEY (servicio_id)
      REFERENCES servicios (servicio_id)
);

-- MENU
CREATE TABLE menu (
  id_menu        SERIAL PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  es_submenu     BOOLEAN DEFAULT FALSE,
  url            VARCHAR(150),
  id_menu_parent INT,
  estado         BOOLEAN DEFAULT TRUE,
  show           BOOLEAN DEFAULT TRUE,

  CONSTRAINT fk_menu_parent FOREIGN KEY (id_menu_parent)
    REFERENCES menu (id_menu)
    ON DELETE SET NULL
);

-- PERMISOS
CREATE TABLE permisos (
  permiso_id          SERIAL PRIMARY KEY,
  usuario_id          INT NOT NULL,
  id_menu             INT NOT NULL,
  estado              BOOLEAN DEFAULT TRUE,
  fecha_creacion      TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ,
  fecha_eliminacion   TIMESTAMPTZ,

  CONSTRAINT fk_perm_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (usuario_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_perm_menu FOREIGN KEY (id_menu)
    REFERENCES menu (id_menu)
    ON DELETE CASCADE,

  CONSTRAINT unq_permiso UNIQUE (usuario_id, id_menu)
);
/*-- Creación de tablas base
CREATE TABLE roles (
  rol_id SERIAL PRIMARY KEY,
  cargo VARCHAR(100),
  descripcion VARCHAR(150),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP
);

CREATE TABLE empleados (
  empleado_id SERIAL PRIMARY KEY,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  cedula VARCHAR(25) NOT NULL,
  rol_id INT NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  fecha_contratacion DATE NOT NULL,
  direccion VARCHAR(150),
  pais VARCHAR(50),
  telefono VARCHAR(15),
  correo VARCHAR(100),
  reportes INT,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_empleados_roles FOREIGN KEY (rol_id) REFERENCES roles (rol_id)
);

CREATE TABLE clientes (
  cliente_id CHAR(5) PRIMARY KEY,
  nombre_empresa VARCHAR(100) NOT NULL,
  nombre_contacto VARCHAR(100),
  cargo_contacto VARCHAR(50),
  direccion VARCHAR(150),
  ciudad VARCHAR(100),
  pais VARCHAR(50),
  telefono VARCHAR(20),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP
);

CREATE TABLE categorias_proveedor (
  categoria_proveedor_id SERIAL PRIMARY KEY,
  nombre_categoria VARCHAR(100) NOT NULL,
  descripcion VARCHAR(150),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP
);

CREATE TABLE proveedores (
  proveedor_id SERIAL PRIMARY KEY,
  categoria_proveedor_id INT NOT NULL,
  nombre_empresa VARCHAR(100) NOT NULL,
  nombre_contacto VARCHAR(100),
  cargo_contacto VARCHAR(50),
  direccion VARCHAR(150),
  ciudad VARCHAR(100),
  pais VARCHAR(50),
  telefono VARCHAR(15),
  correo VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_proveedores_categoria FOREIGN KEY (categoria_proveedor_id)
    REFERENCES categorias_proveedor (categoria_proveedor_id)
);

CREATE TABLE categorias (
  categoria_id SERIAL PRIMARY KEY,
  nombre_categoria VARCHAR(100) NOT NULL,
  descripcion VARCHAR(150),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP
);

CREATE TABLE productos (
  producto_id SERIAL PRIMARY KEY,
  nombre_producto VARCHAR(100) NOT NULL,
  categoria_id INT,
  descripcion VARCHAR(150),
  unidad_de_medida VARCHAR(100) NOT NULL,
  cantidad_en_stock INT NOT NULL,
  precio_unitario NUMERIC(18,2) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias (categoria_id)
);

CREATE TABLE proyectos (
  proyecto_id SERIAL PRIMARY KEY,
  cliente_id CHAR(5) NOT NULL,
  nombre_proyecto VARCHAR(100) NOT NULL,
  descripcion VARCHAR(150),
  ubicacion VARCHAR(100),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  presupuesto_total NUMERIC(18,2) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_proyectos_clientes FOREIGN KEY (cliente_id)
    REFERENCES clientes (cliente_id)
);

CREATE TABLE avaluos (
  avaluo_id SERIAL PRIMARY KEY,
  proyecto_id INT NOT NULL,
  descripcion VARCHAR(200),
  monto_ejecutado NUMERIC(18,2) NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_avaluos_proyecto FOREIGN KEY (proyecto_id)
    REFERENCES proyectos (proyecto_id)
);

CREATE TABLE servicios (
  servicio_id SERIAL PRIMARY KEY,
  nombre_servicio VARCHAR(100) NOT NULL,
  descripcion VARCHAR(200),
  precio_unitario NUMERIC(18,2) NOT NULL,
  cantidad INT NOT NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  unidad_de_medida VARCHAR(50) NOT NULL,
  estado VARCHAR(30),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP
);

CREATE TABLE maquinarias (
  maquinaria_id SERIAL PRIMARY KEY,
  proveedor_id INT,
  nombre_maquinaria VARCHAR(100) NOT NULL,
  marca VARCHAR(50),
  modelo VARCHAR(50),
  precio_por_hora NUMERIC(18,2) NOT NULL,
  descripcion VARCHAR(200),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_maquinarias_proveedor FOREIGN KEY (proveedor_id)
    REFERENCES proveedores (proveedor_id)
);

CREATE TABLE vehiculos (
  vehiculo_id SERIAL PRIMARY KEY,
  proveedor_id INT,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  anio INT NOT NULL,
  placa VARCHAR(15) UNIQUE NOT NULL,
  tipo_de_vehiculo VARCHAR(30),
  tipo_de_combustible VARCHAR(40),
  estado VARCHAR(20),
  fecha_registro DATE,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_vehiculos_proveedor FOREIGN KEY (proveedor_id)
    REFERENCES proveedores (proveedor_id)
);

CREATE TABLE detalles_empleados (
  detalle_empleado_id SERIAL PRIMARY KEY,
  empleado_id INT NOT NULL,
  proyecto_id INT NOT NULL,
  fecha_de_proyecto DATE,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_detalle_empleado FOREIGN KEY (empleado_id)
    REFERENCES empleados (empleado_id),
  CONSTRAINT fk_detalle_proyecto FOREIGN KEY (proyecto_id)
    REFERENCES proyectos (proyecto_id)
);

CREATE TABLE detalles_servicios (
  detalle_servicio_id SERIAL PRIMARY KEY,
  servicio_id INT NOT NULL,
  producto_id INT NOT NULL,
  descripcion VARCHAR(200),
  cantidad INT NOT NULL,
  unidad_de_medida VARCHAR(50) NOT NULL,
  precio_unitario NUMERIC(18,2) NOT NULL,
  estado VARCHAR(30),
  fecha_uso DATE,
  observaciones VARCHAR(200),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_detalle_servicio FOREIGN KEY (servicio_id)
    REFERENCES servicios (servicio_id),
  CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id)
    REFERENCES productos (producto_id)
);

CREATE TABLE detalles_maquinarias (
  detalle_maquinaria_id SERIAL PRIMARY KEY,
  proyecto_id INT,
  maquinaria_id INT,
  horas_utilizadas INT,
  fecha_inicio_renta DATE NOT NULL,
  fecha_fin_renta DATE,
  estado VARCHAR(30),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_detalle_maquinaria FOREIGN KEY (maquinaria_id)
    REFERENCES maquinarias (maquinaria_id),
  CONSTRAINT fk_detalle_proyecto_maquinaria FOREIGN KEY (proyecto_id)
    REFERENCES proyectos (proyecto_id)
);

CREATE TABLE detalles_vehiculos (
  detalle_vehiculo_id SERIAL,
  empleado_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  fecha_asignacion DATE NOT NULL,
  fecha_fin_asignacion DATE,
  descripcion VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  PRIMARY KEY (detalle_vehiculo_id, empleado_id, vehiculo_id),
  CONSTRAINT fk_detalle_empleado_vehiculo FOREIGN KEY (empleado_id)
    REFERENCES empleados (empleado_id),
  CONSTRAINT fk_detalle_vehiculo FOREIGN KEY (vehiculo_id)
    REFERENCES vehiculos (vehiculo_id)
);

CREATE TABLE usuarios (
  usuario_id SERIAL PRIMARY KEY,
  empleado_id INT NOT NULL,
  usuario VARCHAR(100) NOT NULL,
  contrasena VARCHAR(200) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_usuario_empleado FOREIGN KEY (empleado_id)
    REFERENCES empleados (empleado_id)
);

CREATE TABLE compras (
  compra_id SERIAL PRIMARY KEY,
  proveedor_id INT NOT NULL,
  empleado_id INT,
  numero_factura VARCHAR(50) NOT NULL,
  fecha_compra DATE NOT NULL,
  monto_total NUMERIC(18,2) DEFAULT 0,
  estado VARCHAR(50) NOT NULL,
  observaciones VARCHAR(200),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_compra_proveedor FOREIGN KEY (proveedor_id)
    REFERENCES proveedores (proveedor_id),
  CONSTRAINT fk_compra_empleado FOREIGN KEY (empleado_id)
    REFERENCES empleados (empleado_id)
);

CREATE TABLE detalles_compras (
  detalle_compra_id SERIAL PRIMARY KEY,
  compra_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario NUMERIC(18,2) NOT NULL,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  CONSTRAINT fk_detalle_compra FOREIGN KEY (compra_id)
    REFERENCES compras (compra_id),
  CONSTRAINT fk_detalle_producto_compra FOREIGN KEY (producto_id)
    REFERENCES productos (producto_id)
);

CREATE TABLE avaluos_servicios (
  avaluo_servicio_id SERIAL,
  avaluo_id INT NOT NULL,
  servicio_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario NUMERIC(18,2) NOT NULL,
  observaciones VARCHAR(200),
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP,
  fecha_eliminacion TIMESTAMP,
  PRIMARY KEY (avaluo_servicio_id, avaluo_id, servicio_id),
  CONSTRAINT fk_avaluo_servicio FOREIGN KEY (avaluo_id)
    REFERENCES avaluos (avaluo_id),
  CONSTRAINT fk_servicio_avaluo FOREIGN KEY (servicio_id)
    REFERENCES servicios (servicio_id)
);
*/
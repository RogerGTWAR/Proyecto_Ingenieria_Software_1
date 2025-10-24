-- Tabla 1: Categorias_Proveedor
CREATE TABLE Categorias_Proveedor (
    CategoriaProveedorID INT PRIMARY KEY,
    NombreCategoria VARCHAR(255),
    Descripcion TEXT,
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME
);

-- Tabla 2: Proveedores
CREATE TABLE Proveedores (
    ProveedorID INT PRIMARY KEY,
    CategoriaProveedorID INT,
    NombreEmpresa VARCHAR(255),
    NombreContacto VARCHAR(255),
    CargoContacto VARCHAR(100),
    Direccion VARCHAR(255),
    Ciudad VARCHAR(100),
    Pais VARCHAR(100),
    Telefono VARCHAR(20),
    Correo VARCHAR(255),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (CategoriaProveedorID) REFERENCES Categorias_Proveedor(CategoriaProveedorID)
);

-- Tabla 3: Compras
CREATE TABLE Compras (
    CompraID INT PRIMARY KEY,
    ProveedorID INT,
    EmpleadoID INT,
    NumeroFactura VARCHAR(100),
    FechaCompra DATE,
    MontoTotal DECIMAL(10, 2),
    Estado VARCHAR(50),
    Observaciones TEXT,
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID)
    -- FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID) -- Definida después
);

-- Tabla 4: Categorias
CREATE TABLE Categorias (
    CategoriaID INT PRIMARY KEY,
    NombreCategoria VARCHAR(255),
    Descripcion TEXT,
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME
);

-- Tabla 5: Productos
CREATE TABLE Productos (
    ProductoID INT PRIMARY KEY,
    CategoriaID INT,
    NombreProducto VARCHAR(255),
    Descripcion TEXT,
    UnidadDeMedida VARCHAR(50),
    CantidadEnStock INT,
    PrecioUnitario DECIMAL(10, 2),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (CategoriaID) REFERENCES Categorias(CategoriaID)
);

-- Tabla 6: Compra_Detalles
CREATE TABLE Compra_Detalles (
    CompraDetalleID INT PRIMARY KEY,
    CompraID INT,
    ProductoID INT,
    Cantidad INT,
    PrecioUnitario DECIMAL(10, 2),
    Subtotal DECIMAL(10, 2),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (CompraID) REFERENCES Compras(CompraID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

-- Tabla 7: Maquinarias
CREATE TABLE Maquinarias (
    MaquinariaID INT PRIMARY KEY,
    ProveedorID INT,
    NombreMaquinaria VARCHAR(255),
    Marca VARCHAR(100),
    Modelo VARCHAR(100),
    PrecioPorHora DECIMAL(10, 2),
    Descripcion TEXT,
    FechaAdquisicion DATE,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID)
);

-- Tabla 8: Vehiculos
CREATE TABLE Vehiculos (
    VehiculoID INT PRIMARY KEY,
    ProveedorID INT,
    Marca VARCHAR(100),
    Modelo VARCHAR(100),
    Anio INT,
    Placa VARCHAR(20),
    TipoDeVehiculo VARCHAR(100),
    TipoDeCombustible VARCHAR(50),
    Estado VARCHAR(50),
    FechaRegistro DATE,
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (ProveedorID) REFERENCES Proveedores(ProveedorID)
);

-- Tabla 9: Roles
CREATE TABLE Roles (
    RolID INT PRIMARY KEY,
    Cargo VARCHAR(100),
    Descripcion TEXT,
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME
);

-- Tabla 10: Empleados
CREATE TABLE Empleados (
    EmpleadoID INT PRIMARY KEY,
    RolID INT,
    Nombres VARCHAR(100),
    Apellidos VARCHAR(100),
    Cedula VARCHAR(50),
    INSS VARCHAR(50),
    FechaNacimiento DATE,
    FechaContratacion DATE,
    Direccion VARCHAR(255),
    Pais VARCHAR(100),
    Telefono VARCHAR(20),
    Correo VARCHAR(255),
    ReportaA INT,
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (RolID) REFERENCES Roles(RolID),
    FOREIGN KEY (ReportaA) REFERENCES Empleados(EmpleadoID)
);

-- (Añadiendo FK de Empleados a Compras)
ALTER TABLE Compras ADD FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID);

-- Tabla 11: Usuarios
CREATE TABLE Usuarios (
    UsuarioID INT PRIMARY KEY,
    EmpleadoID INT,
    Usuario VARCHAR(100),
    Contrasena VARCHAR(255),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID)
);

-- Tabla 12: Detalles_Vehiculos
CREATE TABLE Detalles_Vehiculos (
    VehiculoDetalleID INT PRIMARY KEY,
    EmpleadoID INT,
    VehiculoID INT,
    FechaAsignacion DATETIME,
    FechaDevolucion DATETIME,
    Descripcion TEXT,
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID),
    FOREIGN KEY (VehiculoID) REFERENCES Vehiculos(VehiculoID)
);

-- Tabla 13: Clientes
CREATE TABLE Clientes (
    ClienteID INT PRIMARY KEY,
    NombreEmpresa VARCHAR(255),
    NombreContacto VARCHAR(255),
    CargoContacto VARCHAR(100),
    Direccion VARCHAR(255),
    Ciudad VARCHAR(100),
    Pais VARCHAR(100),
    Telefono VARCHAR(20),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME
);

-- Tabla 14: Proyectos
CREATE TABLE Proyectos (
    ProyectoID INT PRIMARY KEY,
    ClienteID INT,
    NombreProyecto VARCHAR(255),
    Descripcion TEXT,
    Ubicacion VARCHAR(255),
    FechaInicio DATE,
    FechaFin DATE,
    TiempoTotalDias INT,
    PresupuestoInicial DECIMAL(12, 2),
    Estado VARCHAR(50),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (ClienteID) REFERENCES Clientes(ClienteID)
);

-- Tabla 15: Avaluos
CREATE TABLE Avaluos (
    AvaluoID INT PRIMARY KEY,
    ProyectoID INT,
    Descripcion TEXT,
    MontoTotal DECIMAL(12, 2),
    FechaAvaluo DATE,
    TiempoTotalDias INT,
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (ProyectoID) REFERENCES Proyectos(ProyectoID)
);

-- Tabla 16: Avaluos_Detalles
CREATE TABLE Avaluos_Detalles (
    AvaluoDetalleID INT PRIMARY KEY,
    AvaluoID INT,
    ProductoID INT,
    Descripcion TEXT,
    Cantidad INT,
    PrecioUnitario DECIMAL(10, 2),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (AvaluoID) REFERENCES Avaluos(AvaluoID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

-- Tabla 17: Detalles_Maquinarias
CREATE TABLE Detalles_Maquinarias (
    MaquinariaDetalleID INT PRIMARY KEY,
    ProyectoID INT,
    MaquinariaID INT,
    HorasUtilizadas DECIMAL(10, 2),
    FechaInicioRenta DATETIME,
    FechaFinRenta DATETIME,
    Estado VARCHAR(50),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (ProyectoID) REFERENCES Proyectos(ProyectoID),
    FOREIGN KEY (MaquinariaID) REFERENCES Maquinarias(MaquinariaID)
);

-- Tabla 18: Servicios
CREATE TABLE Servicios (
    ServicioID INT PRIMARY KEY,
    ProyectoID INT,
    NombreServicio VARCHAR(255),
    Descripcion TEXT,
    PrecioUnitario DECIMAL(10, 2),
    Cantidad INT,
    Total DECIMAL(10, 2),
    FechaInicio DATE,
    FechaFin DATE,
    TiempoTotalDias INT,
    UnidadDeMedida VARCHAR(50),
    Estado VARCHAR(50),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (ProyectoID) REFERENCES Proyectos(ProyectoID)
);

-- Tabla 19: Servicios_Detalles
CREATE TABLE Servicios_Detalles (
    ServicioDetalleID INT PRIMARY KEY,
    ServicioID INT,
    ProductoID INT,
    Descripcion TEXT,
    PrecioUnitario DECIMAL(10, 2),
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (ServicioID) REFERENCES Servicios(ServicioID),
    FOREIGN KEY (ProductoID) REFERENCES Productos(ProductoID)
);

-- Tabla 20: Empleados_Detalles
CREATE TABLE Empleados_Detalles (
    EmpleadoDetalleID INT PRIMARY KEY,
    ProyectoID INT,
    EmpleadoID INT,
    FechaInicioProyecto DATE,
    FechaFinProyecto DATE,
    FechaCreacion DATETIME,
    FechaActualizacion DATETIME,
    FechaEliminacion DATETIME,
    FOREIGN KEY (ProyectoID) REFERENCES Proyectos(ProyectoID),
    FOREIGN KEY (EmpleadoID) REFERENCES Empleados(EmpleadoID)
);
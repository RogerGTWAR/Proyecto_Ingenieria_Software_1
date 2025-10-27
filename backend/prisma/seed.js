import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando inserción de datos iniciales...");

  // === 1️⃣ ROLES ===
  await prisma.roles.createMany({
    data: [
      { cargo: "Administrador", descripcion: "Acceso total al sistema" },
      { cargo: "Ingeniero Civil", descripcion: "Encargado de proyectos" },
      { cargo: "Contador", descripcion: "Gestión financiera y compras" },
      { cargo: "Supervisor", descripcion: "Supervisión de obras" },
      { cargo: "Operador de Maquinaria", descripcion: "Manejo de maquinaria pesada" },
      { cargo: "Chofer", descripcion: "Transporte de personal y materiales" },
    ],
    skipDuplicates: true,
  });

  // === 2️⃣ CATEGORÍAS DE PRODUCTOS ===
  await prisma.categorias.createMany({
    data: [
      { nombre_categoria: "Materiales de Construcción", descripcion: "Cemento, arena, hierro, etc." },
      { nombre_categoria: "Herramientas", descripcion: "Taladros, sierras y martillos" },
      { nombre_categoria: "Pinturas", descripcion: "Pinturas, brochas y selladores" },
      { nombre_categoria: "Tuberías", descripcion: "PVC, cobre y conexiones" },
      { nombre_categoria: "Ferretería", descripcion: "Clavos, tornillos, adhesivos" },
    ],
    skipDuplicates: true,
  });

  // === 3️⃣ CATEGORÍAS DE PROVEEDORES ===
  await prisma.categorias_proveedor.createMany({
    data: [
      { nombre_categoria: "Materiales", descripcion: "Proveedores de materiales de construcción" },
      { nombre_categoria: "Maquinaria", descripcion: "Proveedores de maquinaria pesada" },
      { nombre_categoria: "Transporte", descripcion: "Proveedores de transporte y logística" },
      { nombre_categoria: "Ferretería", descripcion: "Suministros de ferretería y herramientas" },
      { nombre_categoria: "Pinturas", descripcion: "Proveedores de pinturas y acabados" },
    ],
    skipDuplicates: true,
  });

  // === 4️⃣ PROVEEDORES ===
  await prisma.proveedores.createMany({
    data: [
      {
        categoria_proveedor_id: 1,
        nombre_empresa: "Casa Pellas S.A.",
        nombre_contacto: "Roberto Gutiérrez",
        cargo_contacto: "Gerente de Ventas",
        direccion: "Carretera Norte, Km 4½",
        ciudad: "Managua",
        pais: "Nicaragua",
        telefono: "+505 2255 6789",
        correo: "contacto@casapellas.com",
      },
      {
        categoria_proveedor_id: 2,
        nombre_empresa: "Renta Pura S.A.",
        nombre_contacto: "Pedro López",
        cargo_contacto: "Encargado de Logística",
        direccion: "Km 8 Carretera León",
        ciudad: "León",
        pais: "Nicaragua",
        telefono: "+505 2311 7654",
        correo: "info@rentapura.com",
      },
      {
        categoria_proveedor_id: 2,
        nombre_empresa: "Nicaragua Machinery Company (NIMAC)",
        nombre_contacto: "Luis Mejía",
        cargo_contacto: "Gerente General",
        direccion: "Carretera Norte, Km 7",
        ciudad: "Managua",
        pais: "Nicaragua",
        telefono: "+505 2283 4450",
        correo: "ventas@nimac.com.ni",
      },
      {
        categoria_proveedor_id: 4,
        nombre_empresa: "Ferromax S.A.",
        nombre_contacto: "Carlos Ruiz",
        cargo_contacto: "Supervisor de Ventas",
        direccion: "Km 6 Carretera Masaya",
        ciudad: "Managua",
        pais: "Nicaragua",
        telefono: "+505 2278 2211",
        correo: "servicio@ferromax.com",
      },
      {
        categoria_proveedor_id: 1,
        nombre_empresa: "Construni S.A.",
        nombre_contacto: "María Morales",
        cargo_contacto: "Administradora",
        direccion: "Barrio San Judas",
        ciudad: "Managua",
        pais: "Nicaragua",
        telefono: "+505 2245 1299",
        correo: "ventas@construni.com",
      },
    ],
    skipDuplicates: true,
  });

  // === 4️⃣ CLIENTES ===
  await prisma.clientes.createMany({
    data: [
      { cliente_id: "C0001", nombre_empresa: "Grupo Pérez S.A.", nombre_contacto: "Carlos Pérez", cargo_contacto: "Gerente General", ciudad: "Managua", pais: "Nicaragua", telefono: "+505 2278 9012" },
      { cliente_id: "C0002", nombre_empresa: "Constructora Nica Ltda.", nombre_contacto: "María López", cargo_contacto: "Directora de Proyectos", ciudad: "Granada", pais: "Nicaragua", telefono: "+505 2280 4455" },
      { cliente_id: "C0003", nombre_empresa: "Inversiones del Sur", nombre_contacto: "José Martínez", cargo_contacto: "Gerente Técnico", ciudad: "Rivas", pais: "Nicaragua", telefono: "+505 2564 7890" },
      { cliente_id: "C0004", nombre_empresa: "Nicaragua Machinery Co.", nombre_contacto: "Ana Gutiérrez", cargo_contacto: "Encargada de Compras", ciudad: "Masaya", pais: "Nicaragua", telefono: "+505 2233 9000" },
      { cliente_id: "C0005", nombre_empresa: "Renta Pura S.A.", nombre_contacto: "Pedro López", cargo_contacto: "Gerente de Operaciones", ciudad: "León", pais: "Nicaragua", telefono: "+505 2311 7654" },
    ],
    skipDuplicates: true,
  });

  // === 5️⃣ EMPLEADOS ===
  await prisma.empleados.createMany({
    data: [
      { nombres: "Luis", apellidos: "Mendoza", cedula: "001-010101-0001A", rol_id: 1, fecha_nacimiento: new Date("1985-05-10"), fecha_contratacion: new Date("2020-01-15"), correo: "luis.mendoza@aconsa.com", telefono: "+505 8888 0001" },
      { nombres: "Carla", apellidos: "Lopez", cedula: "002-020202-0002B", rol_id: 2, fecha_nacimiento: new Date("1990-02-20"), fecha_contratacion: new Date("2021-03-10"), correo: "carla.lopez@aconsa.com", telefono: "+505 8888 0002" },
      { nombres: "Rafael", apellidos: "Castillo", cedula: "003-030303-0003C", rol_id: 3, fecha_nacimiento: new Date("1988-03-25"), fecha_contratacion: new Date("2021-05-01"), correo: "rafael.castillo@aconsa.com", telefono: "+505 8888 0003" },
      { nombres: "Marta", apellidos: "Perez", cedula: "004-040404-0004D", rol_id: 4, fecha_nacimiento: new Date("1982-07-15"), fecha_contratacion: new Date("2020-07-15"), correo: "marta.perez@aconsa.com", telefono: "+505 8888 0004" },
      { nombres: "Ricardo", apellidos: "Torres", cedula: "005-050505-0005E", rol_id: 5, fecha_nacimiento: new Date("1986-06-21"), fecha_contratacion: new Date("2021-04-03"), correo: "ricardo.torres@aconsa.com", telefono: "+505 8888 0005" },
    ],
    skipDuplicates: true,
  });

  // === 6️⃣ PROYECTOS ===
  await prisma.proyectos.createMany({
    data: [
      { cliente_id: "C0001", nombre_proyecto: "Edificio Central ACONSA", descripcion: "Construcción del edificio principal de oficinas.", ubicacion: "Managua", fecha_inicio: new Date("2023-01-10"), fecha_fin: new Date("2023-06-15"), presupuesto_total: 350000.00, estado: "Completado" },
      { cliente_id: "C0002", nombre_proyecto: "Puente San Rafael", descripcion: "Infraestructura vial sobre el río San Rafael.", ubicacion: "León", fecha_inicio: new Date("2024-02-01"), fecha_fin: new Date("2024-08-10"), presupuesto_total: 700000.00, estado: "Activo" },
      { cliente_id: "C0003", nombre_proyecto: "Residencial Los Robles", descripcion: "Desarrollo habitacional de 40 viviendas.", ubicacion: "Rivas", fecha_inicio: new Date("2024-01-20"), fecha_fin: new Date("2024-12-10"), presupuesto_total: 1200000.00, estado: "Activo" },
      { cliente_id: "C0004", nombre_proyecto: "Carretera Masaya", descripcion: "Rehabilitación de 15 km de carretera.", ubicacion: "Masaya", fecha_inicio: new Date("2023-03-01"), fecha_fin: new Date("2023-11-15"), presupuesto_total: 850000.00, estado: "Completado" },
      { cliente_id: "C0005", nombre_proyecto: "Planta de Concreto León", descripcion: "Instalación de planta dosificadora de concreto.", ubicacion: "León", fecha_inicio: new Date("2024-04-10"), fecha_fin: new Date("2024-09-30"), presupuesto_total: 500000.00, estado: "Activo" },
    ],
    skipDuplicates: true,
  });
  
  // === 5️⃣ PRODUCTOS ===
  await prisma.productos.createMany({
    data: [
      { nombre_producto: "Arena Natural", categoria_id: 1, descripcion: "Arena natural para construcción.", unidad_de_medida: "m³", cantidad_en_stock: 100, precio_unitario: 270.00 },
      { nombre_producto: "Piedrín", categoria_id: 1, descripcion: "Piedrín para mezcla y construcción.", unidad_de_medida: "m³", cantidad_en_stock: 120, precio_unitario: 700.00 },
      { nombre_producto: "Bloque de Concreto 4\"", categoria_id: 2, descripcion: "Bloque de concreto de 4 pulgadas.", unidad_de_medida: "unidad", cantidad_en_stock: 500, precio_unitario: 210.50 },
      { nombre_producto: "Bloque de Concreto 6\"", categoria_id: 2, descripcion: "Bloque de concreto de 6 pulgadas.", unidad_de_medida: "unidad", cantidad_en_stock: 450, precio_unitario: 240.00 },
      { nombre_producto: "Adoquín Tipo Tráfico", categoria_id: 2, descripcion: "Adoquín para vías de tráfico pesado.", unidad_de_medida: "unidad", cantidad_en_stock: 300, precio_unitario: 150.00 },
      { nombre_producto: "Medio Adoquín", categoria_id: 2, descripcion: "Medio adoquín para acabados.", unidad_de_medida: "unidad", cantidad_en_stock: 400, precio_unitario: 71.80 },
      { nombre_producto: "Tubos de Concreto", categoria_id: 2, descripcion: "Tubos de concreto para drenaje.", unidad_de_medida: "unidad", cantidad_en_stock: 200, precio_unitario: 2000.00 },
      { nombre_producto: "Losas de Concreto", categoria_id: 2, descripcion: "Losas de concreto para techos.", unidad_de_medida: "unidad", cantidad_en_stock: 100, precio_unitario: 1471.00 },
      { nombre_producto: "Cajas de Concreto", categoria_id: 2, descripcion: "Cajas de concreto para instalaciones eléctricas.", unidad_de_medida: "unidad", cantidad_en_stock: 150, precio_unitario: 700.00 },
      { nombre_producto: "Pintura Latex", categoria_id: 3, descripcion: "Pintura latex para interior.", unidad_de_medida: "litro", cantidad_en_stock: 250, precio_unitario: 25.00 },
    ],
    skipDuplicates: true,
  });

  // === 7️⃣ AVALUOS ===
  await prisma.avaluos.createMany({
    data: [
      { proyecto_id: 1, descripcion: "Avaluo inicial de obra civil.", monto_ejecutado: 125000.0, fecha_inicio: new Date("2023-01-10"), fecha_fin: new Date("2023-03-10") },
      { proyecto_id: 2, descripcion: "Avaluo parcial 1 de puente.", monto_ejecutado: 250000.0, fecha_inicio: new Date("2024-02-01"), fecha_fin: new Date("2024-05-01") },
      { proyecto_id: 3, descripcion: "Avaluo de cimentación de viviendas.", monto_ejecutado: 450000.0, fecha_inicio: new Date("2024-03-01"), fecha_fin: new Date("2024-06-01") },
      { proyecto_id: 4, descripcion: "Avaluo final de carretera.", monto_ejecutado: 800000.0, fecha_inicio: new Date("2023-03-01"), fecha_fin: new Date("2023-11-15") },
      { proyecto_id: 5, descripcion: "Avaluo de estructura metálica.", monto_ejecutado: 200000.0, fecha_inicio: new Date("2024-04-10"), fecha_fin: new Date("2024-07-20") },
    ],
    skipDuplicates: true,
  });

  // === 8️⃣ SERVICIOS ===
  await prisma.servicios.createMany({
    data: [
      { nombre_servicio: "Excavación de terreno", descripcion: "Movimiento de tierra y nivelación del sitio.", precio_unitario: 120.0, cantidad: 500, unidad_de_medida: "m³", estado: "Completado", fecha_inicio: new Date("2023-01-10"), fecha_fin: new Date("2023-02-20") },
      { nombre_servicio: "Colado de losas", descripcion: "Colado de losas de concreto armado.", precio_unitario: 200.0, cantidad: 300, unidad_de_medida: "m²", estado: "Activo", fecha_inicio: new Date("2024-02-01"), fecha_fin: new Date("2024-03-10") },
      { nombre_servicio: "Instalación eléctrica", descripcion: "Cableado, tomacorrientes e iluminación.", precio_unitario: 150.0, cantidad: 100, unidad_de_medida: "unidad", estado: "Activo", fecha_inicio: new Date("2024-03-01"), fecha_fin: new Date("2024-05-15") },
      { nombre_servicio: "Pintura interior", descripcion: "Pintado de muros, techos y acabados.", precio_unitario: 80.0, cantidad: 250, unidad_de_medida: "m²", estado: "En Espera", fecha_inicio: new Date("2024-04-10"), fecha_fin: new Date("2024-05-20") },
      { nombre_servicio: "Supervisión de obra", descripcion: "Supervisión técnica del avance del proyecto.", precio_unitario: 1000.0, cantidad: 1, unidad_de_medida: "servicio", estado: "Completado", fecha_inicio: new Date("2023-01-10"), fecha_fin: new Date("2023-06-15") },
    ],
    skipDuplicates: true,
  });

  // === 9️⃣ DETALLES EMPLEADOS ===
  await prisma.detalles_empleados.createMany({
    data: [
      { empleado_id: 1, proyecto_id: 1, fecha_de_proyecto: new Date("2023-01-15") },
      { empleado_id: 2, proyecto_id: 1, fecha_de_proyecto: new Date("2023-01-20") },
      { empleado_id: 4, proyecto_id: 2, fecha_de_proyecto: new Date("2024-02-10") },
      { empleado_id: 5, proyecto_id: 2, fecha_de_proyecto: new Date("2024-03-01") },
      { empleado_id: 3, proyecto_id: 3, fecha_de_proyecto: new Date("2024-03-10") },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Datos iniciales insertados correctamente 🚀");
}

main()
  .catch((e) => {
    console.error("❌ Error ejecutando seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

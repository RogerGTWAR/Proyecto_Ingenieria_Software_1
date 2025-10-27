import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando inserción de datos iniciales...");

  // === 1️⃣ ROLES ===
  await prisma.roles.createMany({
    data: [
      { cargo: 'Administrador', descripcion: 'Acceso total al sistema' },
      { cargo: 'Ingeniero Civil', descripcion: 'Encargado de proyectos' },
      { cargo: 'Contador', descripcion: 'Gestión financiera y compras' },
      { cargo: 'Supervisor', descripcion: 'Supervisión de obras' },
      { cargo: 'Técnico de Campo', descripcion: 'Tareas de obra y mantenimiento' },
      { cargo: 'Asistente Administrativo', descripcion: 'Gestión documental' },
      { cargo: 'Diseñador', descripcion: 'Diseño estructural y planos' },
      { cargo: 'Jefe de Proyecto', descripcion: 'Dirección técnica de obras' },
      { cargo: 'Operador de Maquinaria', descripcion: 'Manejo de equipos pesados' },
      { cargo: 'Chofer', descripcion: 'Transporte de personal y materiales' },
    ],
    skipDuplicates: true,
  });

  // === 2️⃣ CATEGORÍAS DE PRODUCTOS ===
  await prisma.categorias.createMany({
    data: [
      { nombre_categoria: 'Materiales de Construcción', descripcion: 'Cemento, arena, hierro, etc.' },
      { nombre_categoria: 'Herramientas', descripcion: 'Taladros, sierras, martillos y más' },
      { nombre_categoria: 'Pinturas y Acabados', descripcion: 'Pinturas, brochas y selladores' },
      { nombre_categoria: 'Tuberías', descripcion: 'PVC, cobre, conexiones' },
      { nombre_categoria: 'Electricidad', descripcion: 'Cables, interruptores y lámparas' },
      { nombre_categoria: 'Ferretería', descripcion: 'Clavos, tornillos, adhesivos' },
      { nombre_categoria: 'Protección Personal', descripcion: 'Cascos, botas, chalecos' },
      { nombre_categoria: 'Madera', descripcion: 'Tablones, vigas, MDF' },
      { nombre_categoria: 'Plomería', descripcion: 'Llaves, válvulas, accesorios' },
      { nombre_categoria: 'Decoración', descripcion: 'Azulejos, cerámica, molduras' },
    ],
    skipDuplicates: true,
  });

  // === 3️⃣ CATEGORÍAS DE PROVEEDORES ===
  await prisma.categorias_proveedor.createMany({
    data: [
      { nombre_categoria: 'Materiales', descripcion: 'Proveedores de materiales de construcción' },
      { nombre_categoria: 'Maquinaria', descripcion: 'Proveedores de maquinaria pesada' },
      { nombre_categoria: 'Transporte', descripcion: 'Vehículos y camiones' },
      { nombre_categoria: 'Ferretería', descripcion: 'Suministros diversos' },
      { nombre_categoria: 'Electricidad', descripcion: 'Material eléctrico y alumbrado' },
      { nombre_categoria: 'Plomería', descripcion: 'Sistemas de agua y saneamiento' },
      { nombre_categoria: 'Pinturas', descripcion: 'Proveedores de pintura y selladores' },
      { nombre_categoria: 'Carpintería', descripcion: 'Proveedores de madera y puertas' },
      { nombre_categoria: 'Equipos de Protección', descripcion: 'Ropa y seguridad industrial' },
      { nombre_categoria: 'Servicios Generales', descripcion: 'Mantenimiento y limpieza' },
    ],
    skipDuplicates: true,
  });

  // === 4️⃣ CLIENTES ===
  await prisma.clientes.createMany({
    data: [
      { cliente_id: 'C0001', nombre_empresa: 'Grupo Pérez S.A.', nombre_contacto: 'Carlos Pérez', cargo_contacto: 'Gerente General', ciudad: 'Managua', pais: 'Nicaragua', telefono: '+505 2278 9012' },
      { cliente_id: 'C0002', nombre_empresa: 'Constructora Nica Ltda.', nombre_contacto: 'María López', cargo_contacto: 'Directora de Proyectos', ciudad: 'Granada', pais: 'Nicaragua', telefono: '+505 2280 4455' },
      { cliente_id: 'C0003', nombre_empresa: 'Inversiones del Sur', nombre_contacto: 'José Martínez', cargo_contacto: 'Gerente Técnico', ciudad: 'Rivas', pais: 'Nicaragua', telefono: '+505 2564 7890' },
      { cliente_id: 'C0004', nombre_empresa: 'Nicaragua Machinery Co.', nombre_contacto: 'Ana Gutiérrez', cargo_contacto: 'Encargada de Compras', ciudad: 'Masaya', pais: 'Nicaragua', telefono: '+505 2233 9000' },
      { cliente_id: 'C0005', nombre_empresa: 'Renta Pura S.A.', nombre_contacto: 'Pedro López', cargo_contacto: 'Gerente de Operaciones', ciudad: 'León', pais: 'Nicaragua', telefono: '+505 2311 7654' },
      { cliente_id: 'C0006', nombre_empresa: 'Casa Pellas S.A.', nombre_contacto: 'Laura Gaitán', cargo_contacto: 'Supervisora', ciudad: 'Managua', pais: 'Nicaragua', telefono: '+505 2244 1122' },
      { cliente_id: 'C0007', nombre_empresa: 'Obras Modernas', nombre_contacto: 'Juan Ruiz', cargo_contacto: 'Coordinador de Proyecto', ciudad: 'Estelí', pais: 'Nicaragua', telefono: '+505 2712 3355' },
      { cliente_id: 'C0008', nombre_empresa: 'Construnorte S.A.', nombre_contacto: 'Rosa Morales', cargo_contacto: 'Administradora', ciudad: 'Ocotal', pais: 'Nicaragua', telefono: '+505 2728 4400' },
      { cliente_id: 'C0009', nombre_empresa: 'Ingeniería Total', nombre_contacto: 'José Vargas', cargo_contacto: 'Director General', ciudad: 'Chinandega', pais: 'Nicaragua', telefono: '+505 2345 9876' },
      { cliente_id: 'C0010', nombre_empresa: 'Proyectos del Caribe', nombre_contacto: 'Marcos Hernández', cargo_contacto: 'Gerente de Ventas', ciudad: 'Bluefields', pais: 'Nicaragua', telefono: '+505 2555 4321' },
    ],
    skipDuplicates: true,
  });

  // === 5️⃣ EMPLEADOS ===
  await prisma.empleados.createMany({
    data: [
      { nombres: 'Luis', apellidos: 'Mendoza', cedula: '001-010101-0001A', rol_id: 1, fecha_nacimiento: new Date('1985-05-10'), fecha_contratacion: new Date('2020-01-15'), correo: 'luis.mendoza@aconsa.com', telefono: '+505 8888 0001' },
      { nombres: 'Carla', apellidos: 'Lopez', cedula: '002-020202-0002B', rol_id: 2, fecha_nacimiento: new Date('1990-02-20'), fecha_contratacion: new Date('2021-03-10'), correo: 'carla.lopez@aconsa.com', telefono: '+505 8888 0002' },
      { nombres: 'Rafael', apellidos: 'Castillo', cedula: '003-030303-0003C', rol_id: 3, fecha_nacimiento: new Date('1988-03-25'), fecha_contratacion: new Date('2021-05-01'), correo: 'rafael.castillo@aconsa.com', telefono: '+505 8888 0003' },
      { nombres: 'Marta', apellidos: 'Perez', cedula: '004-040404-0004D', rol_id: 4, fecha_nacimiento: new Date('1982-07-15'), fecha_contratacion: new Date('2020-07-15'), correo: 'marta.perez@aconsa.com', telefono: '+505 8888 0004' },
      { nombres: 'Henry', apellidos: 'Gutierrez', cedula: '005-050505-0005E', rol_id: 5, fecha_nacimiento: new Date('1995-08-18'), fecha_contratacion: new Date('2022-02-12'), correo: 'henry.gutierrez@aconsa.com', telefono: '+505 8888 0005' },
      { nombres: 'Patricia', apellidos: 'Rivas', cedula: '006-060606-0006F', rol_id: 6, fecha_nacimiento: new Date('1989-04-01'), fecha_contratacion: new Date('2022-06-20'), correo: 'patricia.rivas@aconsa.com', telefono: '+505 8888 0006' },
      { nombres: 'Juan', apellidos: 'Mejía', cedula: '007-070707-0007G', rol_id: 7, fecha_nacimiento: new Date('1987-09-12'), fecha_contratacion: new Date('2019-09-01'), correo: 'juan.mejia@aconsa.com', telefono: '+505 8888 0007' },
      { nombres: 'Sara', apellidos: 'Luna', cedula: '008-080808-0008H', rol_id: 8, fecha_nacimiento: new Date('1993-11-05'), fecha_contratacion: new Date('2020-11-15'), correo: 'sara.luna@aconsa.com', telefono: '+505 8888 0008' },
      { nombres: 'Ricardo', apellidos: 'Torres', cedula: '009-090909-0009I', rol_id: 9, fecha_nacimiento: new Date('1986-06-21'), fecha_contratacion: new Date('2021-04-03'), correo: 'ricardo.torres@aconsa.com', telefono: '+505 8888 0009' },
      { nombres: 'Gloria', apellidos: 'Vega', cedula: '010-101010-0010J', rol_id: 10, fecha_nacimiento: new Date('1994-10-12'), fecha_contratacion: new Date('2023-01-10'), correo: 'gloria.vega@aconsa.com', telefono: '+505 8888 0010' },
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

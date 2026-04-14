# Proyecto_Ingenieria_Software_1

## Requisitos del sistema

- Node.js y npm (versión LTS recomendada)
- PostgreSQL
- Git

## Para ejecutar el programa necesitas seguir los siguientes pasos:

### 1. Clonar el repositorio

```bash
git clone https://github.com/RogerGTWAR/Proyecto_Ingenieria_Software_1.git
cd Proyecto_Ingenieria_Software_1
```

### 2. Instalar las dependencias

Ve a la raíz del proyecto y ejecuta el siguiente comando:

```bash
npm install
```

Instala las dependencias del backend y frontend:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Crear la base de datos

En la raíz del proyecto encontrarás el archivo:

```
AconsaBD.sql
```

Debes ejecutarlo en tu gestor de base de datos PostgreSQL para crear la base de datos del sistema.

### 4. Crear el archivo .env en el backend

Dentro de la carpeta `/backend` debes crear un archivo llamado:

```
.env
```

Luego agrega tu cadena de conexión de PostgreSQL:

```env
BASE_URL="postgresql://USUARIO:CONTRASENA@localhost:5432/NOMBRE_BASE_DE_DATOS?schema=public"
PORT=3000
```

Reemplaza:

- `USUARIO` por tu usuario de PostgreSQL  
- `CONTRASENA` por tu contraseña  
- `NOMBRE_BASE_DE_DATOS` por tu base de datos  

### 5. Conectar la base de datos con el backend

En la carpeta `/backend` ejecuta:

```bash
npx prisma db pull
npx prisma generate
```

### 6. Ejecutar el programa

En la raíz del proyecto ejecuta:

```bash
npm run dev
```

## Notas importantes

- El backend corre en: http://localhost:3000  
- El frontend corre en: http://localhost:5173  
- Asegúrate de que PostgreSQL esté encendido antes de ejecutar el proyecto  
- Si npm no funciona, reinstala Node.js

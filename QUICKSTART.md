# 🚀 Guía de Inicio Rápido - TaskMaster

## Inicio con Docker (5 minutos)

### Paso 1: Prerequisitos
```bash
# Verificar que tienes Docker instalado
docker --version
docker-compose --version
```

### Paso 2: Clonar y arrancar
```bash
# Clonar el repositorio
git clone <tu-repo>
cd taskmaster-realtime

# Iniciar todos los servicios
docker-compose up -d

# Esperar ~30 segundos para que todo inicie
```

### Paso 3: Verificar que todo funciona
```bash
# Ver logs
docker-compose logs -f

# Deberías ver:
# ✅ PostgreSQL iniciado
# ✅ Backend corriendo en puerto 3000
# ✅ Frontend corriendo en puerto 5173
```

### Paso 4: Usar la aplicación
1. Abre tu navegador en: http://localhost:5173
2. Regístrate con un nuevo usuario
3. ¡Empieza a crear tareas!

### Paso 5: Probar GraphQL Playground
1. Abre: http://localhost:3000/graphql
2. Ejecuta esta query:
```graphql
mutation {
  register(input: {
    name: "Test User"
    email: "test@example.com"
    password: "123456"
  }) {
    accessToken
    user {
      name
      email
    }
  }
}
```

## Comandos Útiles

```bash
# Detener servicios
docker-compose down

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Reiniciar un servicio
docker-compose restart backend

# Reconstruir contenedores
docker-compose up -d --build

# Limpiar todo (¡cuidado! borra la BD)
docker-compose down -v
```

## Problemas Comunes

### Puerto 5432 ya en uso
```bash
# Detener PostgreSQL local
sudo service postgresql stop

# O cambiar el puerto en docker-compose.yml
ports:
  - "5433:5432"  # Usar 5433 en lugar de 5432
```

### Puerto 3000 o 5173 en uso
```bash
# Encontrar proceso usando el puerto
lsof -i :3000
lsof -i :5173

# Matar el proceso
kill -9 <PID>
```

### Contenedores no arrancan
```bash
# Ver logs detallados
docker-compose logs

# Reconstruir desde cero
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Desarrollo Local (sin Docker)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variables de Entorno

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=taskmaster
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend
No requiere archivo .env para desarrollo local.

## URLs Importantes

- **Frontend**: http://localhost:5173
- **Backend GraphQL**: http://localhost:3000/graphql
- **WebSocket**: ws://localhost:3000
- **PostgreSQL**: localhost:5432

## Primera Vez en la App

1. **Registro**: Crea tu cuenta en /register
2. **Login**: Inicia sesión en /login
3. **Dashboard**: Verás el tablero Kanban vacío
4. **Nueva Tarea**: Click en "+ Nueva tarea"
5. **Crear**: Llena el formulario y guarda
6. **Drag & Drop**: Arrastra tareas entre columnas
7. **Tiempo Real**: Abre en otra pestaña y verás cambios instantáneos

## Demo de Tiempo Real

Para ver las actualizaciones en tiempo real:

1. Abre la app en dos pestañas del navegador
2. En la pestaña 1: Crea una tarea
3. En la pestaña 2: Verás aparecer la tarea instantáneamente
4. Mueve una tarea en la pestaña 1
5. Observa el cambio en la pestaña 2

¡Eso es todo! 🎉

## Siguiente Paso

Lee el README.md completo para:
- Arquitectura del proyecto
- Detalles técnicos
- Queries GraphQL avanzadas
- Contribuir al proyecto
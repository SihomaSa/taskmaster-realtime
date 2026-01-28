# 🚀 TaskMaster - Sistema de Gestión de Tareas en Tiempo Real

Un sistema completo de gestión de tareas con actualizaciones en tiempo real, construido con las tecnologías más modernas del ecosistema JavaScript/TypeScript.

![Tech Stack](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## 📋 Características

### Backend
- ✅ **NestJS** con arquitectura modular
- ✅ **GraphQL** con Apollo Server
- ✅ **TypeORM** para gestión de base de datos
- ✅ **PostgreSQL** como base de datos
- ✅ **JWT Authentication** para seguridad
- ✅ **WebSocket** (Socket.IO) para actualizaciones en tiempo real
- ✅ **TypeScript** estricto

### Frontend
- ✅ **Vue 3** con Composition API
- ✅ **Pinia** para gestión de estado
- ✅ **Apollo Client** para GraphQL
- ✅ **Socket.IO Client** para WebSocket
- ✅ **TypeScript** para type safety
- ✅ **Tailwind CSS** para estilos
- ✅ **Vite** como build tool
- ✅ **Vue Router** para navegación

### Funcionalidades
- 🔐 Autenticación y registro de usuarios
- 📝 CRUD completo de tareas
- 🎯 Tablero Kanban (TODO, IN_PROGRESS, DONE)
- 🔄 Actualizaciones en tiempo real vía WebSocket
- 🎨 Drag & Drop para mover tareas
- 📊 Dashboard con estadísticas
- 🏷️ Prioridades (LOW, MEDIUM, HIGH, URGENT)
- 👥 Asignación de tareas a usuarios
- 📅 Fechas de vencimiento
- 🔔 Notificaciones en tiempo real

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: NestJS 10.x
- **API**: GraphQL con Apollo Server
- **ORM**: TypeORM 0.3.x
- **Base de datos**: PostgreSQL 16
- **WebSocket**: Socket.IO 4.x
- **Autenticación**: JWT con Passport
- **Validación**: class-validator

### Frontend
- **Framework**: Vue 3.4.x
- **Estado**: Pinia 2.x
- **GraphQL Client**: Apollo Client 3.x
- **WebSocket**: Socket.IO Client 4.x
- **Router**: Vue Router 4.x
- **UI**: Tailwind CSS 3.x
- **Build**: Vite 5.x
- **Utilidades**: date-fns

## 📦 Estructura del Proyecto

```
taskmaster-realtime/
├── backend/
│   ├── src/
│   │   ├── auth/              # Módulo de autenticación
│   │   ├── users/             # Módulo de usuarios
│   │   ├── tasks/             # Módulo de tareas
│   │   ├── events/            # WebSocket Gateway
│   │   ├── app.module.ts      # Módulo principal
│   │   └── main.ts            # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Componentes Vue
│   │   ├── views/             # Vistas/Páginas
│   │   ├── stores/            # Pinia stores
│   │   ├── services/          # Servicios (WebSocket)
│   │   ├── types/             # TypeScript types
│   │   ├── router/            # Vue Router
│   │   ├── apollo.ts          # Apollo Client config
│   │   └── main.ts            # Entry point
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml         # Orquestación de servicios
```

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <tu-repo>
cd taskmaster-realtime

# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

**URLs:**
- Frontend: http://localhost:5173
- Backend GraphQL: http://localhost:3000/graphql
- PostgreSQL: localhost:5432

### Opción 2: Instalación Local

#### Requisitos Previos
- Node.js 20+
- PostgreSQL 16+
- npm o yarn

#### Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar en modo desarrollo
npm run start:dev
```

#### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

## 📖 Guía de Uso

### 1. Registro de Usuario
1. Abre http://localhost:5173/register
2. Completa el formulario con:
   - Nombre
   - Email
   - Contraseña (mín. 6 caracteres)
3. Haz clic en "Registrarse"

### 2. Inicio de Sesión
1. Abre http://localhost:5173/login
2. Ingresa tus credenciales
3. Haz clic en "Iniciar sesión"

### 3. Gestión de Tareas

#### Crear una Tarea
1. Haz clic en "+ Nueva tarea"
2. Completa el formulario:
   - **Título** (obligatorio)
   - **Descripción** (opcional)
   - **Prioridad**: LOW, MEDIUM, HIGH, URGENT
   - **Fecha de vencimiento** (opcional)
3. Haz clic en "Crear"

#### Editar una Tarea
1. Haz clic en el icono ✏️ en la tarjeta
2. Modifica los campos necesarios
3. Haz clic en "Actualizar"

#### Mover una Tarea
- **Drag & Drop**: Arrastra la tarjeta entre columnas
- La tarea se moverá automáticamente entre estados

#### Eliminar una Tarea
1. Haz clic en el icono 🗑️ en la tarjeta
2. Confirma la eliminación

### 4. Actualizaciones en Tiempo Real
- Todos los cambios se reflejan instantáneamente
- El indicador de conexión muestra el estado del WebSocket
- Las notificaciones aparecen en la esquina inferior derecha

## 🔧 Desarrollo

### Comandos Útiles

#### Backend
```bash
# Desarrollo con hot-reload
npm run start:dev

# Producción
npm run build
npm run start:prod

# Linting
npm run lint

# TypeORM CLI
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
```

#### Frontend
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

### Testing GraphQL

Abre http://localhost:3000/graphql y prueba las siguientes queries:

#### Registro
```graphql
mutation {
  register(input: {
    name: "Juan Pérez"
    email: "juan@example.com"
    password: "123456"
  }) {
    accessToken
    user {
      id
      name
      email
    }
  }
}
```

#### Login
```graphql
mutation {
  login(input: {
    email: "juan@example.com"
    password: "123456"
  }) {
    accessToken
    user {
      id
      name
      email
    }
  }
}
```

#### Listar Tareas (requiere autenticación)
```graphql
query {
  tasks {
    id
    title
    description
    status
    priority
    dueDate
    assignedTo {
      name
    }
  }
}
```

#### Crear Tarea (requiere autenticación)
```graphql
mutation {
  createTask(input: {
    title: "Mi primera tarea"
    description: "Descripción de la tarea"
    priority: MEDIUM
  }) {
    id
    title
    status
  }
}
```

Para queries autenticadas, agrega el header:
```json
{
  "Authorization": "Bearer <tu-token>"
}
```

## 🏗️ Arquitectura

### Backend Architecture

```
┌─────────────────┐
│   GraphQL API   │
└────────┬────────┘
         │
    ┌────┴─────┐
    │ Resolver │
    └────┬─────┘
         │
    ┌────┴────┐
    │ Service │
    └────┬────┘
         │
    ┌────┴────┐
    │ TypeORM │
    └────┬────┘
         │
    ┌────┴────┐
    │  PostgreSQL  │
    └─────────┘
         +
┌─────────────────┐
│  WebSocket      │
│  (Socket.IO)    │
└─────────────────┘
```

### Frontend Architecture

```
┌──────────────┐
│  Components  │
└──────┬───────┘
       │
  ┌────┴─────┐
  │  Stores  │ (Pinia)
  └────┬─────┘
       │
  ┌────┴──────┬───────────┐
  │           │           │
Apollo    WebSocket   Router
Client    Service
```

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ JWT para autenticación
- ✅ Guards de autenticación en GraphQL
- ✅ Validación de datos con class-validator
- ✅ CORS configurado
- ✅ Variables de entorno para secretos

## 🌟 Características Destacadas para Portfolio

1. **Arquitectura Moderna**: Usa las mejores prácticas de NestJS y Vue 3
2. **Type Safety**: TypeScript en todo el stack
3. **Real-time**: WebSocket con Socket.IO para actualizaciones instantáneas
4. **GraphQL**: API moderna y eficiente
5. **Docker**: Fácil despliegue y desarrollo
6. **UI/UX**: Interfaz intuitiva con Tailwind CSS
7. **State Management**: Pinia con composables modernos
8. **Clean Code**: Código organizado y mantenible

## 📝 Próximas Mejoras

- [ ] Tests unitarios y e2e
- [ ] Roles y permisos de usuarios
- [ ] Equipos y proyectos
- [ ] Comentarios en tareas
- [ ] Archivos adjuntos
- [ ] Notificaciones por email
- [ ] Temas claro/oscuro
- [ ] Búsqueda y filtros avanzados
- [ ] Exportación de datos
- [ ] App móvil con Flutter

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👨‍💻 Autor

**Tu Nombre**
- LinkedIn: [tu-perfil](https://linkedin.com/in/tu-perfil)
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Portfolio: [tu-portfolio.com](https://tu-portfolio.com)

## 🙏 Agradecimientos

- NestJS Team
- Vue.js Team
- Apollo GraphQL
- Tailwind Labs
- Socket.IO Team

---

⭐ Si te ha gustado este proyecto, dale una estrella en GitHub

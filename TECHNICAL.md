# 📐 Documentación Técnica - TaskMaster

## Decisiones de Arquitectura

### 1. Backend: NestJS + GraphQL

#### ¿Por qué NestJS?
- **Arquitectura modular**: Organización clara con módulos, controladores y servicios
- **TypeScript nativo**: Type safety completo
- **Dependency Injection**: Facilita testing y mantenimiento
- **Decoradores**: Sintaxis limpia y expresiva
- **Ecosistema maduro**: Gran cantidad de paquetes y documentación

#### ¿Por qué GraphQL sobre REST?
- **Consultas flexibles**: Cliente pide exactamente lo que necesita
- **Tipado fuerte**: Schema autodocumentado
- **Single endpoint**: Simplifica la arquitectura
- **Subscriptions**: Soporte nativo para tiempo real (aunque usamos WebSocket)
- **Introspección**: GraphQL Playground para desarrollo

#### ¿Por qué TypeORM?
- **TypeScript first**: Integración perfecta con NestJS
- **Active Record / Data Mapper**: Flexibilidad en patrones
- **Migrations**: Control de versiones de BD
- **Relaciones**: Manejo sencillo de relaciones entre entidades
- **Compatibilidad**: Funciona con PostgreSQL, MySQL, SQLite, etc.

### 2. Frontend: Vue 3 + Pinia

#### ¿Por qué Vue 3?
- **Composition API**: Código más organizado y reutilizable
- **Performance**: Virtual DOM optimizado
- **TypeScript**: Soporte de primera clase
- **Reactivity**: Sistema reactivo potente y simple
- **Single File Components**: Encapsulación perfecta

#### ¿Por qué Pinia sobre Vuex?
- **TypeScript**: Inferencia de tipos automática
- **Composition API**: Sintaxis moderna
- **Modular**: Sin mutations, más simple
- **DevTools**: Mejor debugging
- **Lightweight**: Menos boilerplate

#### ¿Por qué Apollo Client?
- **Cache inteligente**: Optimizaciones automáticas
- **TypeScript**: Generación de tipos desde schema
- **DevTools**: Excelentes herramientas de desarrollo
- **Ecosistema**: Integración con Vue
- **Estado normalizado**: Gestión eficiente de datos

### 3. Tiempo Real: Socket.IO

#### ¿Por qué Socket.IO sobre GraphQL Subscriptions?
- **Fallbacks automáticos**: WebSocket → Long Polling → HTTP
- **Rooms & Namespaces**: Organización de conexiones
- **Reconexión automática**: Manejo de desconexiones
- **Binary support**: Si necesitamos enviar archivos
- **Simplicidad**: API más simple que Subscriptions

#### Eventos Implementados
```typescript
// Backend → Frontend
'task:created'    // Nueva tarea creada
'task:updated'    // Tarea actualizada
'task:deleted'    // Tarea eliminada
'notification'    // Notificación general

// Estructura de eventos
{
  task:created: Task,
  task:updated: Task,
  task:deleted: { id: string },
  notification: { 
    userId: string, 
    message: string, 
    type: string, 
    timestamp: Date 
  }
}
```

### 4. Base de Datos: PostgreSQL

#### ¿Por qué PostgreSQL?
- **ACID**: Transacciones confiables
- **JSON support**: Flexibilidad para datos no estructurados
- **Performance**: Excelente para consultas complejas
- **Full-text search**: Búsqueda de texto integrada
- **Extensiones**: PostGIS, pg_trgm, etc.
- **Open source**: Sin costos de licencia

#### Esquema de Base de Datos

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'TODO',
  priority VARCHAR(50) DEFAULT 'MEDIUM',
  due_date TIMESTAMP,
  assigned_to_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### 5. Autenticación: JWT

#### Flow de Autenticación

```
1. Usuario envía credenciales
   ↓
2. Backend valida con bcrypt
   ↓
3. Backend genera JWT token
   ↓
4. Frontend guarda token en localStorage
   ↓
5. Frontend incluye token en headers
   ↓
6. Backend valida token en cada request
```

#### Estructura del JWT Token

```typescript
{
  sub: string,      // User ID
  email: string,    // User email
  iat: number,      // Issued at
  exp: number       // Expiration (7 days)
}
```

### 6. Estado del Frontend

#### Pinia Stores

```typescript
// Auth Store
- user: User | null
- token: string | null
- isAuthenticated: boolean
- login()
- register()
- logout()
- initAuth()

// Tasks Store
- tasks: Task[]
- loading: boolean
- error: string | null
- todoTasks: computed
- inProgressTasks: computed
- doneTasks: computed
- fetchTasks()
- createTask()
- updateTask()
- deleteTask()
- moveTask()
- setupWebSocketListeners()
- cleanupWebSocketListeners()
```

#### Flujo de Datos

```
User Action
    ↓
Vue Component
    ↓
Pinia Action
    ↓
Apollo Client / WebSocket
    ↓
Backend (GraphQL/WS)
    ↓
Database
    ↓
WebSocket Broadcast
    ↓
All Connected Clients
    ↓
Pinia Store Update
    ↓
Vue Reactivity
    ↓
UI Update
```

### 7. UI/UX: Tailwind CSS

#### ¿Por qué Tailwind?
- **Utility-first**: Rapidez de desarrollo
- **Customizable**: Configuración flexible
- **Purge CSS**: Build size mínimo
- **Responsive**: Mobile-first por defecto
- **Consistency**: Sistema de diseño coherente

#### Design System

```typescript
// Colors
primary: blue-600
success: green-600
warning: yellow-600
error: red-600
info: blue-500

// Spacing
xs: 0.5rem
sm: 1rem
md: 1.5rem
lg: 2rem
xl: 3rem

// Breakpoints
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

### 8. Docker: Containerización

#### ¿Por qué Docker?
- **Portabilidad**: Funciona igual en cualquier máquina
- **Aislamiento**: Dependencias encapsuladas
- **Reproducibilidad**: Mismo ambiente para todos
- **CI/CD**: Fácil integración con pipelines
- **Microservicios**: Escalabilidad futura

#### Arquitectura de Contenedores

```
┌─────────────────────────────────┐
│     docker-compose.yml          │
└─────────────────────────────────┘
          │
    ┌─────┼─────┬─────────────┐
    │     │     │             │
┌───▼─┐ ┌─▼──┐ ┌▼────────┐ ┌──▼──┐
│ DB  │ │ BE │ │   FE    │ │Net  │
│5432 │ │3000│ │  5173   │ │work │
└─────┘ └────┘ └─────────┘ └─────┘
```

### 9. Seguridad

#### Medidas Implementadas

1. **Contraseñas**: Hasheadas con bcrypt (10 rounds)
2. **JWT**: Tokens firmados y con expiración
3. **Guards**: Protección de rutas en GraphQL
4. **Validación**: class-validator en DTOs
5. **CORS**: Configurado para origen específico
6. **Environment**: Variables sensibles en .env
7. **SQL Injection**: Protección con TypeORM ORM

#### Mejoras Futuras

- [ ] Rate limiting
- [ ] Helmet.js para headers HTTP
- [ ] CSRF protection
- [ ] Input sanitization
- [ ] Audit logging
- [ ] Two-factor authentication

### 10. Performance

#### Optimizaciones

**Backend:**
- Eager loading de relaciones donde sea necesario
- Índices en columnas frecuentemente consultadas
- Connection pooling de PostgreSQL
- Cache de queries GraphQL (futuro)

**Frontend:**
- Code splitting con Vite
- Lazy loading de rutas
- Memoización en computed properties
- Virtual scrolling para listas grandes (futuro)
- Image optimization (futuro)

**WebSocket:**
- Eventos específicos (no broadcast a todos)
- Payload mínimo en eventos
- Reconexión automática con backoff

### 11. Escalabilidad

#### Estrategia de Crecimiento

**Corto Plazo (actual):**
```
1 Backend → 1 Database → N Clientes
```

**Medio Plazo:**
```
N Backends (load balanced)
  ↓
Redis (session store + cache)
  ↓
Database Replica (read/write split)
```

**Largo Plazo:**
```
API Gateway
  ↓
Microservicios:
  - Auth Service
  - Task Service
  - Notification Service
  - File Service
  ↓
Message Queue (RabbitMQ/Kafka)
  ↓
Database Sharding
```

### 12. Testing Strategy (futuro)

```typescript
// Backend
- Unit Tests: Jest + Supertest
- Integration Tests: PostgreSQL test DB
- E2E Tests: Jest

// Frontend
- Unit Tests: Vitest
- Component Tests: Vue Test Utils
- E2E Tests: Playwright/Cypress
```

### 13. CI/CD Pipeline (futuro)

```yaml
# GitHub Actions
1. Lint & Format
2. Run Tests
3. Build Docker Images
4. Push to Registry
5. Deploy to Staging
6. Run E2E Tests
7. Deploy to Production
```

### 14. Monitoreo (futuro)

```
- Logging: Winston + ELK Stack
- Metrics: Prometheus + Grafana
- Errors: Sentry
- APM: New Relic
- Uptime: Pingdom
```

## Patrones de Diseño Utilizados

### Backend
1. **Module Pattern**: Organización en módulos NestJS
2. **Dependency Injection**: IoC container de NestJS
3. **Repository Pattern**: TypeORM repositories
4. **DTO Pattern**: Data Transfer Objects
5. **Guard Pattern**: Protección de rutas

### Frontend
1. **Composition Pattern**: Vue 3 Composition API
2. **Store Pattern**: Pinia stores
3. **Observer Pattern**: Vue reactivity
4. **Provider Pattern**: Apollo Client
5. **Component Pattern**: Single File Components

## Estructura de Archivos

### Backend
```
src/
├── auth/
│   ├── dto/
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── auth.resolver.ts
│   ├── jwt.strategy.ts
│   └── gql-auth.guard.ts
├── users/
│   ├── user.entity.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.resolver.ts
├── tasks/
│   ├── dto/
│   ├── task.entity.ts
│   ├── tasks.module.ts
│   ├── tasks.service.ts
│   └── tasks.resolver.ts
├── events/
│   ├── events.module.ts
│   └── events.gateway.ts
├── app.module.ts
└── main.ts
```

### Frontend
```
src/
├── components/
│   ├── TaskCard.vue
│   ├── TaskColumn.vue
│   └── TaskModal.vue
├── views/
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   └── DashboardView.vue
├── stores/
│   ├── auth.ts
│   └── tasks.ts
├── services/
│   └── socket.ts
├── types/
│   └── index.ts
├── router/
│   └── index.ts
├── apollo.ts
├── style.css
├── App.vue
└── main.ts
```

## Conclusión

Esta arquitectura proporciona:

✅ **Escalabilidad**: Fácil de escalar vertical y horizontalmente
✅ **Mantenibilidad**: Código organizado y modular
✅ **Type Safety**: TypeScript en todo el stack
✅ **Performance**: Optimizaciones en varios niveles
✅ **Developer Experience**: Herramientas modernas y documentación
✅ **User Experience**: Interfaz reactiva y en tiempo real
✅ **Security**: Múltiples capas de seguridad
✅ **Testability**: Arquitectura que facilita testing

El proyecto está diseñado para crecer desde un MVP hasta una aplicación enterprise-grade.
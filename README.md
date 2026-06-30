# PoliRed - Sistema Web
### Panel de Administración y Control para la Red Social Universitaria

React | Vite | Tailwind CSS | Axios | React Router

---

## Descripción
**PoliRed - Sistema Web** es el cliente frontend desarrollado en React y Vite diseñado para la administración, moderación y control de la red social universitaria **PoliRed**. Esta plataforma web permite a los Super Administradores y Administradores de Red (Admin_Red) gestionar de manera eficiente las comunidades (redes), procesar reportes de comportamiento de los usuarios, coordinar las solicitudes de creación de nuevas redes comunitarias y resolver apelaciones de suspensiones de cuentas.

La aplicación consume los servicios REST del backend de PoliRed, implementando un control de accesos basado en roles, persistencia segura de sesión y una interfaz enriquecida con animaciones y efectos interactivos.

---

## Características Principales
*    **Autenticación y Sesión Persistente:** Gestión centralizada del estado de autenticación con `AuthContext` y `sessionStorage`, lo que permite mantener la sesión activa de forma segura.
*    **Consola de Super Administrador:**
    *   **Redes:** Control y visualización de la red global y subcomunidades universitarias.
    *   **Solicitudes de Redes:** Aprobación o rechazo de nuevas comunidades propuestas.
    *   **Estudiantes:** Administración de usuarios registrados y aplicación de sanciones.
    *   **Reportes:** Moderación global y resolución de reportes de contenido inapropiado o spam.
    *   **Apelaciones:** Revisión y resolución del sistema de sanciones y apelaciones enviadas por estudiantes.
*    **Consola de Administrador de Red (Admin_Red):**
    *   **Miembros (Estudiantes):** Control de miembros activos dentro de la red a su cargo.
    *   **Roles:** Asignación y revocación de roles específicos dentro de la red comunitaria.
    *   **Solicitudes y Reportes Locales:** Moderación interna y ágil procesamiento de peticiones específicas de su red.
*    **Cliente de API Robusto:** Cliente Axios centralizado (`apiClient.js`) con interceptores para inyección automática del token Bearer JWT y control global de errores (redirección a login en caso de error `401 Unauthorized`, notificaciones toast en errores `403 Forbidden` y `500 Internal Server Error`).
*    **Experiencia e Interfaz Premium (UI/UX):** Estilo moderno y estilizado con Tailwind CSS, combinando animaciones fluidas con Framer Motion, GSAP, Radix UI y componentes visuales avanzados (Aurora, Particles, ShineBorder, StarBorder, Masonry, entre otros).

---

## Arquitectura del Proyecto
El proyecto sigue una estructura limpia orientada a componentes modulares y la separación de responsabilidades:

1.  **Manejo de Estado de Autenticación (`AuthContext.jsx`):** Proveedor global que distribuye datos del usuario, el rol (`superadmin` o `admin_red`) y el token JWT a toda la aplicación.
2.  **Control de Rutas (`ProtectedRoute.jsx` & `PublicRoute.jsx`):** Implementación de guardas de seguridad en React Router que impiden accesos no autorizados a páginas protegidas de administración.
3.  **Capa de Servicios (`src/services/`):** Clientes de API dedicados para modularizar las peticiones HTTP por entidad (`superadminService.js`, `adminRedService.js`, `authService.js`, `publicacionesService.js`).
4.  **Componentes Reutilizables:** Diseños dinámicos en la carpeta `src/components` que mejoran la legibilidad y la interacción del usuario.

### Estructura de Capas en `src/`
*   `layout/`: Plantillas principales de la consola (`Dashboard.jsx`, `DashboardRed.jsx`) y lógica de enrutamiento protegido.
*   `pages/`: Vistas completas de la aplicación (Home, Login, Profile, Redes, Solicitudes, Reportes, Apelaciones, etc.).
*   `services/`: Orquestadores de peticiones Axios configurados con el cliente HTTP principal.
*   `components/`: Elementos visuales, botones, animaciones dinámicas y componentes de formularios interactivos.
*   `hooks/`: Ganchos personalizados para simplificar la lógica de React.

---

## Guía de Inicio Rápido (Local)

### Requisitos Previos
*   **Node.js** (versión LTS o superior recomendada).
*   Gestor de paquetes **npm** o **pnpm**.
*   Acceso a la API Backend de PoliRed (en desarrollo local o URL de producción).

### Instalación
Ejecutar una terminal en la carpeta principal del proyecto:
```bash
# Instalar las dependencias del proyecto
npm install
# O usando pnpm
pnpm install
```

Configurar las variables de entorno creando un archivo `.env` en la raíz del proyecto:
```env
VITE_BACKEND_URL=https://tu-backend-api.vercel.app/api
```
> [!NOTE]
> Para pruebas en desarrollo local con el backend corriendo en la máquina, definir `VITE_BACKEND_URL=http://localhost:3000/api` (o el puerto correspondiente).

### Ejecución
Para ejecutar el servidor de desarrollo local con Vite:
```bash
npm run dev
```

Para generar la compilación para producción del sitio web:
```bash
npm run build
```

Para analizar el formato y calidad del código:
```bash
npm run lint
```

---

## Integración con el Backend

PoliRed Web Console interactúa con las rutas del servidor usando Axios. Las peticiones a rutas protegidas incluyen el JWT en el header: `Authorization: Bearer <token>`.

*   **Autenticación:**
    *   `POST /auth/login` (Inicio de sesión)
    *   `POST /auth/recuperar-password`
    *   `POST /auth/confirmar-cuenta/:token`
*   **SuperAdmin:**
    *   `GET /superadmin/redes`
    *   `GET /superadmin/solicitudes`
    *   `GET /superadmin/apelaciones`
*   **Admin Red:**
    *   `GET /admin-red/estudiantes`
    *   `PUT /admin-red/revocar-rol`
    *   `GET /admin-red/reportes`

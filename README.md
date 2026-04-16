# Estudiar en Informática - UNLP Dashboard 🎓

¡Bienvenido al Dashboard Académico definitivo para los estudiantes de la **Facultad de Informática (UNLP)**! Esta plataforma moderna ha sido diseñada para centralizar tu progreso, materiales y planificación en un solo lugar, con una experiencia de usuario de primer nivel.

## ✨ Características Principales

- **Gestión Multi-usuario**: Sistema de autenticación seguro (Login/Registro) con Supabase Auth.
- **Soporte Multi-carrera**: Inscríbete en múltiples carreras de la facultad (Licenciatura en Informática, Sistemas, Ingeniería, ATIC, etc.) y alterna entre ellas instantáneamente.
- **Seguimiento de Materias**: Listado dinámico de materias por año (incluyendo Ingreso), con estados personalizados (Pendiente, En Curso, Aprobada, Final Pendiente).
- **Gestión de Archivos**: Sube y gestiona tus resúmenes y materiales de estudio directamente asociados a cada materia.
- **Calendario de Exámenes**: Planifica tus fechas de exámenes y gestiona eventos con una interfaz intuitiva.
- **Dashboard de Métricas**: Visualiza tu promedio general, materias aprobadas y progreso porcentual con gráficos dinámicos.
- **Herramientas de Productividad**: Timer Pomodoro integrado y lista de tareas rápida.
- **Diseño Responsive**: Optimizado para PC y dispositivos móviles con menú hamburguesa inteligente.

## 🛠️ Tecnologías Utilizadas

Este proyecto utiliza un stack moderno para garantizar velocidad, seguridad y escalabilidad:

- **Frontend**: [React.js](https://reactjs.org/) (Vite)
- **Base de Datos y Auth**: [Supabase](https://supabase.com/) (PostgreSQL con Row Level Security)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Estilos**: Vanilla CSS con variables personalizadas (Design System)
- **Despliegue**: [Vercel](https://vercel.com/)

## 🚀 Instalación y Desarrollo Local

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/christianberti/dashboard-academico.git
    ```
2.  Instala las dependencias:
    ```bash
    cd dashboard-academico/frontend
    npm install
    ```
3.  Configura las variables de entorno en `src/config.js` con tus credenciales de Supabase.
4.  Inicia el servidor de desarrollo:
    ```bash
    npm run dev
    ```

## 🔒 Seguridad y Privacidad

Gracias a **Supabase RLS**, cada usuario tiene su propia sección privada. Nadie más puede ver tus materias, archivos o notas. Tus datos son exclusivamente tuyos.

---
Proyecto desarrollado para facilitar el camino académico de los estudiantes de Informática. ¡Mucho éxito en la cursada! 🚀

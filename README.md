# FinTrack

## Gestor de Finanzas Personales

FinTrack es una aplicación web para la gestión de finanzas personales. Permite a los usuarios registrar y controlar sus ingresos y gastos, organizar sus movimientos mediante categorías, establecer presupuestos y definir objetivos de ahorro.

El proyecto ha sido desarrollado como Proyecto Final del Máster en Desarrollo Full Stack, integrando un backend desarrollado con Django y Django REST Framework con un frontend desarrollado con React y Vite.

## Funcionalidades

- Gestión de usuarios
- Registro de nuevos usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante sesiones de Django.
- Consulta del estado de autenticación.
- Edición del perfil.
- Cambio de contraseña.
- Configuración de moneda.
- Foto de perfil.

## Transacciones

- Registro de ingresos.
- Registro de gastos.
- Asociación de transacciones a categorías.
- Edición de transacciones.
- Eliminación de transacciones.
- Filtrado por tipo.
- Filtrado por categoría.
- Filtrado por mes y año.
- Búsqueda por descripción.

## Categorías

- Creación de categorías.
- Diferenciación entre categorías de ingresos y gastos.
- Personalización del color.
- Asociación de iconos.
- Edición de categorías.
- Eliminación de categorías cuando no tienen transacciones asociadas.

## Presupuestos

- Creación de presupuestos mensuales.
- Asociación de presupuestos a categorías.
- Cálculo del gasto realizado.
- Cálculo del importe restante.
- Porcentaje de presupuesto utilizado.
- Indicadores visuales del estado del presupuesto.

## Objetivos de ahorro

- Creación de objetivos.
- Definición de una cantidad objetivo.
- Seguimiento del importe ahorrado.
- Fecha objetivo opcional.
- Registro de aportaciones.
- Historial de aportaciones.
- Actualización automática del importe ahorrado.
- Visualización del porcentaje de progreso.

## Dashboard

El dashboard proporciona una visión general de la situación financiera del usuario:

- Balance mensual.
- Total de ingresos.
- Total de gastos.
- Número de transacciones.
- Número de categorías.
- Últimas transacciones.
- Mayor ingreso.
- Mayor gasto.
- Gastos agrupados por categoría.
- Comparación entre ingresos y gastos.
- Presupuestos actuales.
- Objetivos de ahorro.

Los datos mostrados en el dashboard son obtenidos desde el backend mediante la API.

## Tecnologías utilizadas

### Backend

- Python
- Django 6.0.7
- Django REST Framework 3.17.1
- SQLite para desarrollo
- PostgreSQL mediante dj-database-url en entornos de despliegue
- Gunicorn
- WhiteNoise
- django-cors-headers
- Pillow
- python-dotenv

### Frontend

- React
- Vite
- React Router
- Axios
- Bootstrap
- Chart.js
- react-chartjs-2
- React Icons

### Despliegue

- GitHub para el almacenamiento del código fuente.
- Render para el backend Django.
- Vercel para el frontend React.


## Arquitectura

FinTrack utiliza una arquitectura separada entre frontend y backend.

Usuario
   │
   ▼
React + Vite
(Vercel)
   │
   │ HTTP / REST API
   ▼
Django REST Framework
(Render)
   │
   ▼
Base de datos
(SQLite / PostgreSQL)

El frontend se comunica con el backend mediante peticiones HTTP utilizando Axios.

La autenticación utiliza las sesiones de Django y cookies, junto con protección CSRF para las operaciones que modifican datos.

## Estructura del proyecto

FinTrack/
│
├── accounts/
│   ├── models.py
│   ├── forms.py
│   ├── views.py
│   └── urls.py
│
├── api/
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── budgets/
│   ├── models.py
│   ├── forms.py
│   ├── views.py
│   └── urls.py
│
├── categories/
│   ├── models.py
│   ├── forms.py
│   ├── views.py
│   └── urls.py
│
├── dashboard/
│   ├── views.py
│   └── urls.py
│
├── goals/
│   ├── models.py
│   ├── forms.py
│   ├── views.py
│   └── urls.py
│
├── transactions/
│   ├── models.py
│   ├── forms.py
│   ├── views.py
│   └── urls.py
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── templates/
├── static/
├── media/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── manage.py
├── requirements.txt
└── README.md

## Modelos principales

### Usuario

FinTrack utiliza un modelo de usuario personalizado basado en AbstractUser.
Además de los campos proporcionados por Django, incorpora:

- Moneda.
- Foto de perfil.

### Transaction

Representa un movimiento financiero.
Incluye:

- Usuario.
- Categoría.
- Tipo de transacción.
- Importe.
- Descripción.
- Fecha.
- Fecha de creación.

### Category

Representa una categoría financiera.
Incluye:

- Usuario.
- Nombre.
- Tipo: ingreso o gasto.
- Color.
- Icono.

Las categorías son independientes para cada usuario.

### Budget

Representa un presupuesto asociado a una categoría y a un determinado mes y año.
Incluye:

- Usuario.
- Categoría.
- Importe.
- Mes.
- Año.

### Goal

Representa un objetivo de ahorro.
Incluye:

- Usuario.
- Nombre.
- Descripción.
- Cantidad objetivo.
- Cantidad ahorrada.
- Fecha objetivo.

### GoalContribution

Representa una aportación realizada a un objetivo de ahorro.
Incluye:

- Objetivo.
- Cantidad aportada.
- Nota.
- Fecha.

El importe ahorrado del objetivo se actualiza a partir de sus aportaciones.

### API

El backend proporciona una API REST bajo el prefijo:

/api/

Entre los principales endpoints se encuentran:

GET/POST              /api/transactions/
GET/PUT/DELETE        /api/transactions/<id>/


GET/POST              /api/categories/
GET/PUT/DELETE        /api/categories/<id>/


GET/POST              /api/budgets/
GET/PUT/DELETE        /api/budgets/<id>/


GET/POST              /api/goals/
GET/PUT/DELETE        /api/goals/<id>/


GET/POST              /api/goals/<id>/contributions/


GET/PUT               /api/profile/
POST                  /api/password-change/


GET                   /api/dashboard/


GET                   /api/me/
GET                   /api/csrf/


POST                  /api/login/
POST                  /api/logout/
POST                  /api/register/

Los endpoints que gestionan información privada requieren que el usuario esté autenticado.

## Instalación y ejecución local

### 1. Clonar el repositorio

git clone https://github.com/agustinburgues/FinTrack.git
cd FinTrack

### 2. Crear el entorno virtual

En Windows:
python -m venv env

Activar el entorno:
env\Scripts\activate

En Linux/macOS:
source env/bin/activate

### 3. Instalar las dependencias

pip install -r requirements.txt

### 4. Configurar las variables de entorno

Crear un archivo .env en la raíz del proyecto.

Ejemplo:

SECRET_KEY=tu-clave-secreta
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173

En producción, las variables sensibles deben configurarse mediante las variables de entorno del servicio de despliegue.

### 5. Ejecutar las migraciones

python manage.py migrate

### 6. Crear un superusuario

Opcionalmente: python manage.py createsuperuser

### 7. Iniciar el backend

python manage.py runserver

El backend estará disponible normalmente en:http://127.0.0.1:8000/

## Ejecución del frontend

Entrar en la carpeta del frontend:
cd frontend

Instalar las dependencias:
npm install

Iniciar el servidor de desarrollo:
npm run dev

El frontend estará disponible normalmente en:http://localhost:5173/

## Variables de entorno

La aplicación utiliza variables de entorno para evitar almacenar directamente información sensible en el código.

Entre las principales variables utilizadas por Django se encuentran:

SECRET_KEY
DEBUG
ALLOWED_HOSTS
CORS_ALLOWED_ORIGINS
CSRF_TRUSTED_ORIGINS

La configuración de la base de datos permite utilizar una URL de conexión mediante dj-database-url, facilitando el cambio entre el entorno local y el entorno de producción.

## Seguridad

FinTrack incorpora diferentes mecanismos de seguridad proporcionados por Django y Django REST Framework:

- Autenticación mediante sesiones de Django.
- Contraseñas almacenadas mediante el sistema de hashing de Django.
- Protección CSRF.
- Validación de datos recibidos por la API.
- Control de permisos mediante IsAuthenticated y AllowAny.
- Separación de los datos por usuario.
- Configuración CORS para permitir únicamente los orígenes autorizados.
- Uso de HTTPS en producción.
- Variables de entorno para información sensible.
- Protección de archivos estáticos mediante WhiteNoise.

Los endpoints que gestionan información financiera requieren autenticación y únicamente permiten acceder a los datos asociados al usuario autenticado.

## Despliegue

- La aplicación está desplegada utilizando dos servicios.

## Frontend

React + Vite está desplegado en Vercel.

URL:https://fin-track-eight-ashen.vercel.app/

## Backend

Django está desplegado en Render.

URL:https://fintrack-wi01.onrender.com/

El frontend utiliza Axios para comunicarse con la API REST del backend.

## Flujo básico de uso

- El usuario accede a FinTrack.
- Puede iniciar sesión o crear una cuenta.
- Una vez autenticado accede al dashboard.
- Desde el dashboard puede consultar su situación financiera.
- Puede registrar ingresos y gastos.
- Puede organizar sus movimientos mediante categorías.
- Puede establecer presupuestos mensuales.
- Puede crear objetivos de ahorro.
- Puede realizar aportaciones a sus objetivos.
- Puede consultar y modificar su perfil.

## React y comunicación con el backend

El frontend está desarrollado con React y consume información real proporcionada por la API de Django.
Por ejemplo, el dashboard realiza peticiones al endpoint:

/api/dashboard/

y recibe información como:

- Balance.
- Ingresos.
- Gastos.
- Últimas transacciones.
- Gastos por categoría.
- Presupuestos.
- Objetivos.

Los datos recibidos se utilizan para construir los diferentes componentes visuales del dashboard, incluyendo gráficos mediante Chart.js.

## Objetivo del proyecto

El objetivo de FinTrack es proporcionar una herramienta sencilla para centralizar la gestión de las finanzas personales y facilitar el seguimiento de ingresos, gastos, presupuestos y objetivos de ahorro.

Desde el punto de vista técnico, el proyecto integra desarrollo backend con Django, creación de una API REST, desarrollo frontend con React, autenticación, persistencia de datos y despliegue de una aplicación full stack funcional.

## Autor

Proyecto desarrollado como Proyecto Final del Máster en Desarrollo Full Stack.

Agustín Burgues

Repositorio:https://github.com/agustinburgues/FinTrack
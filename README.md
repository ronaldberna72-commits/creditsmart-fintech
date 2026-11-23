# CreditSmart — Plataforma FinTech de Simulación y Gestión de Créditos

Aplicación web full-stack serverless construida con **React 18, TypeScript, Vite, Tailwind CSS y Firebase (Firestore + Auth)** para la simulación financiera, proyección de tablas de amortización y gestión integral de solicitudes de crédito con control de acceso basado en roles (**Cliente** y **Asesor Financiero**).

---

## Características Principales

- **Catálogo Dinámico de Créditos:** Visualización de productos financieros con tasas Efectivas Anuales (E.A.), rangos de monto en pesos colombianos (`COP`), plazos máximos y modal detallado de requisitos y beneficios.
- **Simulador Financiero & Tabla de Amortización Francesa:**
  - Cálculo matemático exacto convirtiendo Tasa Efectiva Anual (E.A.) a Tasa Nominal Mes Vencido (N.M.V.).
  - Desglose mes a mes de cuota fija, abono a capital, intereses y saldo restante.
  - Visualización proporcional de capital vs. intereses y exportación directa a **CSV**.
  - Búsqueda en tiempo real, filtro por rango de monto y ordenamiento por tasa.
- **Radicación Inteligente con Validación de Esquemas:**
  - Formularios gestionados con **React Hook Form + Zod**.
  - Cálculo en tiempo real de la **relación cuota/ingreso (DTI)** para evaluar la capacidad de endeudamiento antes de enviar.
- **Arquitectura Dual (Firebase Cloud + Modo Demo Local):**
  - Se conecta automáticamente a **Cloud Firestore** y **Firebase Auth** al configurar el archivo `.env`.
  - Si no existen credenciales configuradas, activa un motor local (`localStorage`) con cambio instantáneo entre perfil **Cliente** y **Asesor Admin**.
- **Pruebas Unitarias Automatizadas:** Suite de tests financieros implementada con **Vitest**.

---

## Arquitectura del Proyecto

```text
creditsmart-fintech/
├── .vscode/                  # Configuración y extensiones recomendadas para VS Code
├── firestore.rules           # Reglas de seguridad basadas en roles para Firestore
├── src/
│   ├── components/           # Componentes UI reutilizables (Navbar, CreditCard, Tabla, Gráfico)
│   ├── config/               # Inicialización segura de Firebase y detección de entorno
│   ├── context/              # Estado global de autenticación y roles (AuthContext)
│   ├── data/                 # Datos semilla del catálogo FinTech
│   ├── hooks/                # Custom hooks desacoplados (useCredits, useApplications)
│   ├── pages/                # Vistas principales (Catálogo, Simulador, Solicitud, Panel)
│   ├── schemas/              # Validaciones estrictas con Zod
│   ├── services/             # Capa de acceso a datos (Firestore CRUD + Auth)
│   ├── types/                # Contratos e interfaces TypeScript
│   └── utils/                # Lógica financiera y pruebas unitarias (*.test.ts)
├── .env.example              # Plantilla de variables de entorno
└── package.json
```

---

## Instalación y Ejecución en Ubuntu / Linux (VS Code)

### Requisitos previos
- **Node.js** `v18+` o `v20+` y `npm` instalados en Ubuntu.
  ```bash
  # Si aún no tienes Node.js en Ubuntu 24.04:
  sudo apt update && sudo apt install -y nodejs npm
  node -v && npm -v
  ```

### Pasos para ejecutar en local

1. **Extraer el proyecto y abrirlo en Visual Studio Code:**
   ```bash
   unzip creditsmart-fintech-pro.zip -d creditsmart-fintech
   cd creditsmart-fintech
   code .
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (opcional):**
   ```bash
   cp .env.example .env
   ```
   > **Nota:** Puedes ejecutar la aplicación inmediatamente sin editar `.env` gracias al **Modo Demo Local** integrado. Si deseas persistencia real en la nube, pega tus credenciales de Firebase Web App en `.env`.

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre en tu navegador: `http://localhost:5173`

5. **Ejecutar pruebas unitarias (Vitest):**
   ```bash
   npm test
   ```

---

## Stack Tecnológico

- **Frontend:** React 18, TypeScript 5, React Router DOM 6
- **Estilos:** Tailwind CSS 3, Lucide Icons, Sonner (Notificaciones Toast)
- **Formularios y Validación:** React Hook Form, Zod
- **Backend as a Service:** Firebase v11 (Cloud Firestore & Firebase Authentication)
- **Tooling & Testing:** Vite 6, Vitest

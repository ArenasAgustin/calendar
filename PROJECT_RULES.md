# Reglas del Proyecto - Calendar App

## 📋 Información General del Proyecto

Este proyecto es una aplicación de calendario desarrollada con Next.js, React, Shadcn UI, TypeScript y TailwindCSS. Las siguientes reglas deben seguirse para mantener la consistencia y calidad del código.

## 🏗️ Estructura del Proyecto

```
calendar/
├── app/                  # Next.js App Router
│   ├── [year]/           # Rutas dinámicas por año
│   ├── api/              # API Routes
│   ├── globals.css       # Estilos globales
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página principal
├── components/           # Componentes React
│   ├── ui/               # Componentes UI reutilizables (shadcn/ui)
│   └── *.tsx             # Componentes específicos del calendario
├── __tests__/            # Tests con Jest y React Testing Library
│   ├── components/       # Tests de componentes
│   ├── utils/            # Tests de utilidades
│   └── *.test.tsx        # Archivos de test
├── utils/                # Utilidades y configuración
│   ├── constants.ts      # Constantes globales
│   ├── functions.ts      # Funciones utilitarias
│   ├── interfaces.ts     # Interfaces TypeScript
│   └── types.ts          # Tipos TypeScript
├── public/               # Archivos estáticos
├── lib/                  # Librerías y configuraciones
├── jest.setup.js         # Configuración global de Jest
└── jest.d.ts             # Tipos TypeScript para Jest
```

## 🔧 Tecnologías y Dependencias

### Stack Principal
- **Next.js 15.3.0** - Framework React con App Router
- **React 19.1.0** - Librería de UI
- **TypeScript 5.8.3** - Tipado estático
- **TailwindCSS 4.1.3** - Framework CSS utilitario

### Componentes UI
- **Radix UI** - Componentes accesibles headless
- **Lucide React** - Iconos
- **shadcn/ui** - Sistema de componentes

## 📝 Convenciones de Código

### 1. Nomenclatura de Archivos
- **Componentes React**: PascalCase (`Calendar.tsx`, `MonthCalendar.tsx`)
- **Utilidades**: camelCase (`functions.ts`, `constants.ts`)
- **Tipos e Interfaces**: camelCase (`types.ts`, `interfaces.ts`)
- **Páginas Next.js**: camelCase (`page.tsx`, `layout.tsx`)

### 2. Nomenclatura de Variables y Funciones
- **Variables**: camelCase (`currentYear`, `selectedMonth`)
- **Funciones**: camelCase (`getDaysInMonth`, `fetchNotes`)
- **Constantes**: UPPER_SNAKE_CASE o camelCase según contexto
- **Componentes**: PascalCase (`Calendar`, `ModalNote`)

### 3. Estructura de Componentes
```typescript
"use client"; // Solo cuando sea necesario

import { ... } from "react";
import { ... } from "next/...";
import { ... } from "@/components/...";
import { ... } from "@/utils/...";

interface ComponentProps {
  // Props tipadas
}

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
  // Hooks primero
  // Estado local
  // Funciones auxiliares
  // Render
}
```

### 4. Gestión de Estado
- **Usar `useReducer`** para estado complejo (como `calendarReducer`)
- **Definir actions** con tipos específicos en `types.ts`
- **Separar reducers** por dominio (`calendarReducer`, `noteReducer`)

### 5. Importaciones
- **Orden de importaciones**:
  1. React y hooks
  2. Next.js
  3. Librerías externas
  4. Componentes internos (`@/components/`)
  5. Utilidades (`@/utils/`)

- **Usar alias de path**: `@/*` para rutas absolutas
- **Importaciones específicas**: Evitar `import *`

## 🎨 Estilos y UI

### 1. TailwindCSS
- **Usar clases utilitarias** de Tailwind como primera opción
- **Responsive design**: Mobile-first approach
- **Consistencia**: Usar el sistema de diseño establecido

### 2. Componentes UI
- **Radix UI** para componentes complejos (modals, selects)
- **shadcn/ui** para componentes base reutilizables
- **Lucide React** para todos los iconos

### 3. Accesibilidad
- Seguir las mejores prácticas de accesibilidad
- Usar componentes Radix UI que ya incluyen ARIA
- Asegurar contraste adecuado de colores

## 🔍 TypeScript

### 1. Configuración Estricta
- **Strict mode**: Habilitado en `tsconfig.json`
- **No implicit any**: Siempre tipar explícitamente
- **Null checks**: Manejar casos null/undefined

### 2. Organización de Tipos
- **Interfaces**: En `interfaces.ts` para contratos de datos
- **Types**: En `types.ts` para uniones, acciones, etc.
- **Tipos específicos**: En el mismo archivo del componente si son únicos

### 3. Convenciones de Tipado
```typescript
// Interfaces para props de componentes
interface ComponentNameProps {
  prop1: string;
  prop2?: number; // Opcional
}

// Types para acciones de reducers
type Action = 
  | { type: "SET_YEAR"; payload: number }
  | { type: "SELECT_MONTH"; payload: number };

// Tipos para estado
interface CalendarState {
  currentYear: number;
  selectedMonth: number | null;
  // ...
}
```

## 🗂️ Gestión de Datos

### 1. Persistencia
- **Local Storage**: Para modo offline (codificado en base64)
- **API Routes**: Para modo servidor (`/api`)
- **Constante `isLocal`**: Para alternar entre modos

### 2. Estructura de Datos
```typescript
interface DayNote {
  day: number;
  month: number;
  year: number;
  note: string;
}
```

## 🧪 Testing y Calidad

### 1. Jest Testing Setup
- **Framework**: Jest con React Testing Library
- **Configuración**: `jest.setup.js` para configuración global
- **Tipos**: `jest.d.ts` incluye tipos de Jest y @testing-library/jest-dom
- **Matchers extendidos**: `toBeInTheDocument()`, `toHaveClass()`, etc.
- **Ubicación tests**: `__tests__/` directorio en la raíz
- **Mocking**: Mock de Next.js router y componentes en tests

```typescript
// jest.d.ts - Configuración de tipos
/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />
```

### 2. ESLint
- **Configuración**: Next.js + TypeScript rules
- **Ejecutar**: `npm run lint` antes de commits
- **Auto-fix**: Configurar en el editor

### 3. Mejores Prácticas
- **Funciones puras**: Preferir funciones sin efectos secundarios
- **Separación de responsabilidades**: Un archivo, una responsabilidad
- **Reutilización**: Extraer lógica común a utilidades
- **Testing**: Escribir tests para componentes críticos

## 🚀 Desarrollo y Deploy

### 1. Scripts Disponibles
```bash
pnpm run dev        # Desarrollo con Turbopack
pnpm run build      # Build de producción
pnpm run start      # Servidor de producción
pnpm run lint       # Linting
pnpm run test       # Ejecutar tests
pnpm run test:watch # Ejecutar tests en modo watch
pnpm run test:verbose # Ejecutar tests con más verbosidad
pnpm run test:coverage # Ejecutar tests con cobertura
```

## 📦 Dependencias

### 1. Gestión de Paquetes
- **pnpm**: Gestor de paquetes preferido
- **Lock file**: Siempre commitear `pnpm-lock.yaml`
- **Versiones**: Mantener actualizadas las dependencias

### 2. Nuevas Dependencias
- Evaluar necesidad real antes de agregar
- Preferir librerías mantenidas y populares
- Documentar el propósito en el PR

## 🔒 Seguridad y Rendimiento

### 1. Seguridad
- **No hardcodear** API keys o secretos
- **Validar inputs** del usuario
- **Sanitizar** datos antes de persistir

### 2. Rendimiento
- **Lazy loading**: Para componentes pesados
- **Memoización**: `useMemo`/`useCallback` cuando sea apropiado
- **Bundle size**: Monitorear el tamaño del bundle

## 🤝 Contribución

Al contribuir a este proyecto:
1. Lee y sigue estas reglas
2. Mantén consistencia con el código existente
3. Documenta cambios significativos
4. Pregunta si tienes dudas sobre las convenciones

---

**Última actualización**: 31 de Julio, 2025
**Versión del proyecto**: 0.1.0

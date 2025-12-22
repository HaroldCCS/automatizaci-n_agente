# React + Vite + TypeScript + Tailwind

Template para aplicaciones React con Vite, TypeScript, React Router y Tailwind CSS.

## 📋 Requisitos Previos

- Node.js 22 
- pnpm (recomendado) o npm

## 🚀 Instalación

Instalar dependencias:

```bash
pnpm install
```

O con npm:

```bash
npm install
```

## 💻 Desarrollo

Iniciar servidor de desarrollo:

```bash
pnpm run dev
```

O con npm:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Build

Construir para producción:

```bash
pnpm run build
```

O con npm:

```bash
npm run build
```

### Vista previa del build

```bash
pnpm run preview
```

O con npm:

```bash
npm run preview
```

## 🐳 Docker

### Construir imagen

```bash
docker build -t react-vite-app .
```

### Ejecutar contenedor

```bash
docker run -d -p 8080:80 --name mi-app react-vite-app
```

La aplicación estará disponible en `http://localhost:8080`

### Detener y eliminar contenedor

```bash
docker stop mi-app
docker rm mi-app
```

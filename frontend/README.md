# Frontend - Products & Providers UI

React + TypeScript + Vite + DaisyUI application for managing products and providers.

## Stack
- React 19
- TypeScript
- Vite
- DaisyUI + Tailwind CSS
- Axios + React Hook Form

## Features
- Full CRUD for providers
- Full CRUD for products
- Product-provider relationship handling
- Pagination (providers and products)
- Sorting, filtering and search
- Product detail view and provider detail view
- Loading states, error messages and toast notifications

## Environment variables
Create `.env` in `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

## Install & run
```bash
cd frontend
bun install
bun run dev
```

## Build
```bash
bun run build
```

## Routes
- `/products`
- `/providers`

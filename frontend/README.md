# Frontend - Products & Providers UI

React + TypeScript + Vite + DaisyUI web app for managing products and providers.

## ✅ What this project includes
- Full CRUD for **Products** and **Providers**
- Pagination, sorting, filtering, and search
- Product/provider relationship management
- Responsive design with a clean UI
- Toast notifications, loading states, and form validation

---

## 🧰 Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS + DaisyUI
- Axios

---

## 🚀 Run locally
### 1) Prerequisites
- Node.js 20+ (or Bun) 
- Backend API running (see backend README)

### 2) Environment variables
Create a `.env` file in the `frontend/` folder:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### 3) Install & start
```bash
cd frontend
bun install
bun run dev
```

### 4) Build
```bash
bun run build
```

---

## 🌐 Routes
- `/products` - Product management (CRUD + filters)
- `/providers` - Provider management (CRUD + filters)

---

## 🐳 Docker (Dokku / container deployment)
From the `frontend/` folder:

```bash
docker build -t testcommunity-frontend .
# Replace 80 with another port if needed
docker run -p 80:80 testcommunity-frontend
```

---

## 📌 Notes
- The UI fetches providers list to show provider names in the products table.
- Filtering, sorting, and pagination are driven by query params to the API.

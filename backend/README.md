# Backend API - Products & Providers

REST API built with **Elysia + Bun + MongoDB (Mongoose)**.

## ✅ What this project includes
- Full CRUD for **Products** and **Providers** (RESTful endpoints)
- One-to-many relationship: **each product belongs to one provider** using `providerId`
- Pagination, sorting, filtering, and field selection (sparse fieldsets)
- Consistent error responses and HTTP status codes

---

## 🧰 Stack
- Runtime: Bun
- Framework: Elysia
- Database: MongoDB (Mongoose)

---

## 🚀 Run locally
### 1) Prerequisites
- Bun >= 1.1
- MongoDB (local or cloud)

### 2) Environment variables
Create a `.env` file in the `backend/` folder:

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/testcommunity
```

### 3) Install & start
```bash
cd backend
bun install
bun run dev
```

### 4) Production start
```bash
bun run start
```

---

## 📡 API Base URL
`http://localhost:3000`

---

## 🧭 Endpoints
### Providers
- `GET /providers` - list providers
- `GET /providers/:id` - get provider details
- `POST /providers` - create provider
- `PUT /providers/:id` - update provider
- `PATCH /providers/:id` - update provider (partial)
- `DELETE /providers/:id` - delete provider

### Products
- `GET /products` - list products
- `GET /products/:id` - get product details
- `POST /products` - create product
- `PUT /products/:id` - update product
- `PATCH /products/:id` - update product (partial)
- `DELETE /products/:id` - delete product

---

## 🔎 Advanced query features (applies to list endpoints)
### Pagination
- `?page=2&limit=10`

### Sorting
- `?sort=name` (asc)
- `?sort=-price` (desc)
- Multiple: `?sort=name,-price`

### Sparse fieldsets (field selection)
- `?fields=_id,name,price`

### Filtering
- Exact match: `?name=Laptop`
- Range: `?price[gte]=100&price[lte]=500`
- Partial (case-insensitive): `?name[like]=tech`

---

## ✅ Response format
### Success
```json
{
  "success": true,
  "data": {
    "items": [...],
    "meta": {
      "page": 1,
      "limit": 10,
      "totalItems": 123,
      "totalPages": 13
    }
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "price",
        "message": "Price must be a positive number"
      }
    ]
  }
}
```

---

## 🐳 Docker (Dokku / container deployment)
From the `backend/` folder:

```bash
docker build -t testcommunity-backend .
docker run -e MONGO_URL="mongodb://..." -p 3000:3000 testcommunity-backend
```

---

## 📝 Notes
- Relationship: **one provider → many products**
- Provider validated when creating/updating a product

# Backend API - Products & Providers

REST API built with Elysia + Bun + MongoDB (Mongoose).

## Stack
- Bun runtime
- Elysia.js
- MongoDB + Mongoose

## Relationship decision
This project uses **One-to-Many**:
- one provider can have many products
- each product belongs to one provider using `providerId`

## Prerequisites
- Bun >= 1.1
- MongoDB instance (local or cloud)

## Environment variables
Create a `.env` file in `backend/`:

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/testcommunity
```

## Install & run
```bash
cd backend
bun install
bun run dev
```

## API base URL
`http://localhost:3000`

## Endpoints

### Providers
- `GET /providers`
- `GET /providers/:id`
- `POST /providers`
- `PUT /providers/:id`
- `DELETE /providers/:id`

### Products
- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Advanced query features
Available in `GET /providers` and `GET /products`:

- Pagination: `?page=2&limit=10`
- Sorting: `?sort=name,-price`
- Sparse fieldsets: `?fields=_id,name,price`
- Filtering exact: `?name=Laptop`
- Filtering range: `?price[gte]=100&price[lte]=500`
- Like filter: `?name[like]=tech`

## Response format

Success:
```json
{
	"success": true,
	"data": {}
}
```

Error:
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
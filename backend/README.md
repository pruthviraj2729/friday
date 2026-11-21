# Friday Authentication API

Authentication-only Express and MongoDB API for the Friday client. Requires Node.js 20+ and a running MongoDB instance.

## Run locally

```powershell
cd backend
Copy-Item .env.example .env
# Set distinct ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET values in .env
npm install
npm run dev
```

The API listens on port `5000` by default. All responses use either `{ "success": true, "message": "...", "data": {} }` or `{ "success": false, "message": "...", "errors": [] }`.

## Vite development proxy

Configure the frontend Vite server to proxy `/api` to the backend; the backend does not enable CORS:

```js
server: {
  proxy: {
    "/api": {
      target: "http://localhost:5000",
      changeOrigin: true
    }
  }
}
```

## Endpoints

Base path: `/api/v1/auth`

| Method | Path | Request | Success data |
| --- | --- | --- | --- |
| POST | `/register` | `{ "name": "Alex Doe", "email": "alex@example.com", "password": "securepass1" }` | `{ "accessToken": "...", "user": { "id": "...", "name": "Alex Doe", "email": "alex@example.com" } }` |
| POST | `/login` | `{ "email": "alex@example.com", "password": "securepass1" }` | Access token and public user; refresh token is an httpOnly cookie |
| POST | `/refresh` | Refresh cookie is sent automatically | Rotated access token and public user |
| POST | `/logout` | Refresh cookie is sent automatically | `{}` |
| GET | `/me` | `Authorization: Bearer <accessToken>` | Public user |

Example validation failure:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Enter a valid email address" }]
}
```

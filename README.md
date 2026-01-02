
# Monitored Services

A full-stack **Service Monitoring & Incident Management System** built to demonstrate real-time system health monitoring, incident lifecycle management, and modern full-stack architecture.

---

## Project Structure

```
monitored-services/
├── backend/            # AdonisJS 6 API (Node.js)
├── frontend/           # Nuxt 4 Dashboard (Vue.js)
├── tmp/                # SQLite database storage (Docker Volume)
├── docker-compose.yml  # System orchestration
└── README.md           # Documentation
```

---

## Architecture Overview

**High-level architecture:**

```
┌────────────┐      HTTP / JSON       ┌──────────────┐
│  Frontend  │  ─────────────────▶   │   Backend    │
│  Nuxt 4    │                        │  AdonisJS 6  │
└────────────┘                        └──────┬───────┘
                                                   │
                                                   │ ORM
                                                   ▼
                                           ┌────────────┐
                                           │  SQLite DB │
                                           └────────────┘
```

### Key Design Principles
- Decoupled frontend and backend
- API-first architecture
- Stateless authentication (Bearer Token)
- Server-side caching with Nitro
- Background jobs & schedulers

---

## Features

### Public Status Page
- Live service status dashboard
- Overall system health banner
- Auto-refresh every 10 seconds
- Detailed service cards

### Admin Panel
- Secure login (Bearer Token)
- Create and manage incidents
- View incident history
- Real-time incident updates

### Incident Simulation (Scheduler)
- Automatic incident updates
- Simulates real-world outages for testing
- Runs in background without manual triggers

---

## Authentication

Authentication is handled using **Bearer Tokens**.

### Login Response Example
```json
{
  "type": "Bearer",
  "token": {
    "token": "oat_xxx",
    "expiresAt": null
  },
  "user": {
    "id": 1,
    "email": "admin@admin.com",
    "fullName": "Admin User"
  }
}
```

The token is stored securely in cookies and attached to all admin API requests.

---

## Scheduler & Incident Simulation

This project includes a **background scheduler** used only for development and demo purposes.

### What It Does
- Periodically changes incident statuses
- Simulates service degradation and recovery
- Helps test UI, polling, and banners without manual actions

### Example Flow
1. Incident created automatically
2. Status changes:
   - `investigating`
   - `identified`
   - `monitoring`
   - `resolved`
3. Service status updates accordingly

### Why It Exists
- Demonstrate real-time systems
- Test polling and caching behavior

> This scheduler is **not intended for production use**.

---

## API Overview

### Services
- `GET /services`
  Returns all monitored services and their current status

### Authentication
- `POST /login`
  Returns bearer token and user info

### Incidents (Admin)
- `GET /admin/incidents`
- `POST /admin/incidents`

All admin routes require:
```
Authorization: Bearer <token>
```

---

## Caching Strategy

- **Nitro Cache** used on public endpoints
- `s-maxage=30` for service list
- Admin endpoints bypass cache
- Client polling every 10 seconds

This ensures:
- High performance
- Low server load
- Near real-time updates

---

## Docker Setup

Run the full system using Docker:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker-compose up --build
```

This will start:
- Backend API
- Frontend dashboard
- SQLite database (volume)

---

## Development Notes

- Backend: AdonisJS 6 + Lucid ORM
- Frontend: Nuxt 4 + Composition API
- Styling: Tailwind CSS
- Icons: Lucide
- Date handling: date-fns

---

## 📄 License

MIT License – free to use, modify, and distribute.

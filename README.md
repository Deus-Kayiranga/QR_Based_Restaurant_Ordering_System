# QR-Based Restaurant Ordering System

A full-stack restaurant ordering system where customers scan a QR code on their table to browse the menu, place orders, and make payments — all from their phone. Staff manage everything through a role-based dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.5, Spring Security, JWT, WebSocket |
| Frontend | React 19, Vite, TypeScript, TailwindCSS |
| Database | PostgreSQL 16 |
| Containerization | Docker, Docker Compose |
| Web Server | Nginx |

---

## System Architecture

```
Customer Phone
     │
     ▼
deus-frontend (nginx :80)
     │
     ├── /api/*  ──────────► deus-backend (Spring Boot :8080)
     │                                │
     └── /ws/*   ──────────►          │ (WebSocket)
                                      ▼
                               deus-postgres (PostgreSQL :5432)
```

---

## Features

### Customer
- Scan QR code to identify table
- Browse full menu with categories and search
- Add items to cart with special notes
- Place and track orders in real time
- View bill and make payment (Cash, MoMo, Airtel Money)

### Staff Roles
| Role | Access |
|------|--------|
| Super Admin | Full system control, staff management, table & menu management |
| Manager | Dashboard, orders, menu, tables, reports, stock |
| Waiter | Assigned tables, order management |
| Kitchen Staff | Kitchen display, order queue |
| Bar Staff | Bar display, order queue |
| Cashier | Bills, payment processing |

---

## Project Structure

```
QR_Based_Restaurant_Ordering_System/
├── docker-compose.yml                        ← orchestrates all 3 services
├── DOCKER_README.md                          ← full Docker setup guide
├── qr-ordering-system/                       ← Spring Boot backend
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/java/com/deus/restaurant/
│       ├── controller/                       ← REST API endpoints
│       ├── service/                          ← business logic
│       ├── model/                            ← JPA entities
│       ├── repository/                       ← Spring Data repositories
│       ├── security/                         ← JWT auth filter
│       └── config/                           ← Security, WebSocket config
└── restaurant-qr-ordering-system-frontend/  ← React frontend
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── api/                              ← Axios API calls
        ├── pages/                            ← customer, manager, waiter, kitchen...
        ├── components/                       ← reusable UI components
        ├── contexts/                         ← Auth, Cart, WebSocket contexts
        └── hooks/                            ← custom React hooks
```

---

## Running with Docker

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Deus-Kayiranga/QR_Based_Restaurant_Ordering_System.git
cd QR_Based_Restaurant_Ordering_System

# 2. Build all Docker images
docker compose build

# 3. Start all containers
docker compose up -d

# 4. Check containers are running
docker compose ps
```

### Access the Application

| Service | URL |
|---------|-----|
| Frontend (React app) | http://localhost |
| Backend API | http://localhost:8080 |

### Stop the Application

```bash
docker compose down
```

---

## Running Locally (Without Docker)

### Backend

**Requirements:** Java 17, Maven, PostgreSQL

```bash
cd qr-ordering-system

# Update src/main/resources/application.properties with your local DB credentials

./mvnw spring-boot:run
```

### Frontend

**Requirements:** Node.js 20+

```bash
cd restaurant-qr-ordering-system-frontend

npm install
npm run dev
```

Frontend runs on `http://localhost:5174`

---

## API Endpoints (Key Routes)

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |
| GET | `/api/tables` | Public |
| POST | `/api/qr/validate` | Public |
| GET | `/api/menu/items` | Public |
| POST | `/api/orders` | Public (customers) |
| GET | `/api/dashboard/stats` | Staff only |
| GET | `/api/orders/queue/kitchen` | Kitchen/Bar staff |

---

## Docker Services

| Container | Image | Port |
|-----------|-------|------|
| `deus-postgres` | postgres:16-alpine | 5432 (internal) |
| `deus-backend` | custom (eclipse-temurin:17) | 8080 |
| `deus-frontend` | custom (nginx:alpine) | 80 |

For full Docker documentation see [DOCKER_README.md](./DOCKER_README.md)

---

## Author

**Kayiranga Deus**  
AUCA — Best Programming Exam Project  
Email: deuskayiranga12@gmail.com  
GitHub: [@Deus-Kayiranga](https://github.com/Deus-Kayiranga)

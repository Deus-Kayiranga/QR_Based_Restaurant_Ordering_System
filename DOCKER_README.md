# Deus Restaurant — Docker Setup Guide

This document explains how the Docker setup was built for the Deus Restaurant QR Ordering System and how to run it step by step.

---

## Project Structure

```
qr-ordering-system/                          ← root (docker-compose lives here)
├── docker-compose.yml                       ← orchestrates all 3 services
├── qr-ordering-system/                      ← Spring Boot backend
│   ├── Dockerfile                           ← backend image build instructions
│   ├── src/main/resources/
│   │   └── application.properties           ← updated to read Docker env vars
│   └── ...
└── restaurant-qr-ordering-system-frontend/  ← React + Vite frontend
    ├── Dockerfile                           ← frontend image build instructions
    └── nginx.conf                           ← nginx server config (port 80 + proxy)
```

---

## How the Docker Files Were Built

### 1. Backend Dockerfile (`qr-ordering-system/Dockerfile`)

```dockerfile
# Stage 1: Build
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Production
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Why 2 stages?**

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| Stage 1 (builder) | `eclipse-temurin:17-jdk-alpine` | Full JDK needed to compile Java source code |
| Stage 2 (production) | `eclipse-temurin:17-jre-alpine` | Lightweight JRE only — no compiler, smaller final image |

**What each line does:**
- `dependency:go-offline` — downloads all Maven dependencies first (layer caching — faster rebuilds)
- `./mvnw clean package -DskipTests` — compiles and packages the app into a `.jar`, skipping tests
- `COPY --from=builder` — copies only the final `.jar` from stage 1 into the lean stage 2 image
- `EXPOSE 8080` — documents that the app listens on port 8080
- `ENTRYPOINT` — runs the jar when the container starts

---

### 2. Frontend Dockerfile (`restaurant-qr-ordering-system-frontend/Dockerfile`)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx vite build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Why 2 stages?**

| Stage | Base Image | Purpose |
|-------|-----------|---------|
| Stage 1 (builder) | `node:20-alpine` | Node.js needed to install packages and run Vite build |
| Stage 2 (production) | `nginx:alpine` | Tiny nginx web server — just serves static HTML/JS/CSS files |

**What each line does:**
- `COPY package*.json ./` then `npm install` — installs dependencies as a separate layer (cached if package.json unchanged)
- `npx vite build` — compiles TypeScript + React into static files in the `/dist` folder
- `COPY --from=builder /app/dist` — copies only the built static files into nginx
- `nginx.conf` — custom config that handles SPA routing and proxies API calls to the backend

---

### 3. nginx.conf (`restaurant-qr-ordering-system-frontend/nginx.conf`)

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://deus-backend:8080;
        ...
    }

    location /ws/ {
        proxy_pass http://deus-backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        ...
    }
}
```

**What each block does:**
- `listen 80` — nginx listens on port 80
- `try_files $uri $uri/ /index.html` — SPA routing: any unknown URL falls back to `index.html` so React Router handles it
- `location /api/` — forwards all `/api/...` requests to the Spring Boot backend container
- `location /ws/` — forwards WebSocket connections to the backend (used for real-time order updates)

---

### 4. docker-compose.yml (root)

```yaml
services:
  postgres:       ← Service 1: Database
  backend:        ← Service 2: Spring Boot API
  frontend:       ← Service 3: React + nginx

volumes:
  postgres_data:  ← persistent storage for database

networks:
  deus-network:   ← private bridge network connecting all 3 services
    driver: bridge
```

**The 3 services explained:**

#### postgres service
```yaml
postgres:
  image: postgres:16-alpine          # uses official Postgres image, no build needed
  container_name: deus-postgres
  environment:
    POSTGRES_DB: deus_restaurant_db  # creates this database on first start
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: 26706
  volumes:
    - postgres_data:/var/lib/postgresql/data  # data survives container restarts
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U postgres -d deus_restaurant_db"]
    interval: 10s
    retries: 5
```
The `healthcheck` makes Docker wait until Postgres is actually ready before starting the backend.

#### backend service
```yaml
backend:
  build:
    context: ./qr-ordering-system    # builds from the backend Dockerfile
  container_name: deus-backend
  ports:
    - "8080:8080"                    # host:container port mapping
  environment:
    SPRING_DATASOURCE_URL: jdbc:postgresql://deus-postgres:5432/deus_restaurant_db
    # uses container name "deus-postgres" as hostname — works because same network
  depends_on:
    postgres:
      condition: service_healthy     # waits for postgres healthcheck to pass
```

#### frontend service
```yaml
frontend:
  build:
    context: ./restaurant-qr-ordering-system-frontend
  container_name: deus-frontend
  ports:
    - "80:80"
  depends_on:
    - backend
```

---

### 5. application.properties — Docker Environment Variable Support

The Spring Boot config was updated to use environment variable overrides with local fallbacks:

```properties
# Before (hardcoded — only works locally):
spring.datasource.url=jdbc:postgresql://localhost:5432/deus_restaurant_db

# After (works both locally AND in Docker):
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/deus_restaurant_db}
```

The syntax `${ENV_VAR:default_value}` means:
- In Docker → reads `SPRING_DATASOURCE_URL` from `docker-compose.yml` environment
- Locally → falls back to `localhost:5432`

Also changed `server.address=127.0.0.1` → `server.address=0.0.0.0` so the backend accepts connections from other containers on the network.

---

## Prerequisites

Before running, make sure you have installed:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Engine + Docker Compose)
- Git (to clone the project)

Verify installation:
```bash
docker --version
docker compose version
```

---

## How to Run — Step by Step

### Step 1 — Clone the repository

```bash
git clone <your-repo-url>
cd qr-ordering-system
```

### Step 2 — Navigate to the root folder

Make sure you are in the folder that contains `docker-compose.yml`:

```bash
cd qr-ordering-system   # the root folder with docker-compose.yml
```

### Step 3 — Build all Docker images

This builds the backend and frontend images from their Dockerfiles:

```bash
docker compose build
```

> First run takes several minutes — Maven downloads dependencies and npm installs packages.
> Subsequent builds are much faster due to Docker layer caching.

To force a clean rebuild from scratch:
```bash
docker compose build --no-cache
```

### Step 4 — Start all containers

```bash
docker compose up -d
```

- `-d` runs containers in the background (detached mode)
- Docker starts them in the correct order: `postgres` → `backend` → `frontend`

### Step 5 — Verify containers are running

```bash
docker compose ps
```

Expected output:
```
NAME            IMAGE                         STATUS
deus-postgres   postgres:16-alpine            Up (healthy)
deus-backend    qr-ordering-system-backend    Up
deus-frontend   qr-ordering-system-frontend   Up
```

All three should show `Up`. Postgres should show `(healthy)`.

### Step 6 — Open the application

| Service | URL |
|---------|-----|
| Frontend (React app) | http://localhost |
| Backend API | http://localhost:8080 |
| API via nginx proxy | http://localhost/api/... |

---

## Useful Commands

### View live logs
```bash
# all services
docker compose logs -f

# specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres
```

### Stop all containers
```bash
docker compose down
```

### Stop and remove all data (including database volume)
```bash
docker compose down -v
```

### Restart a single service
```bash
docker compose restart backend
```

### Rebuild and restart one service after code changes
```bash
docker compose up -d --build backend
docker compose up -d --build frontend
```

### Open a shell inside a container
```bash
docker exec -it deus-backend sh
docker exec -it deus-postgres sh
docker exec -it deus-frontend sh
```

### Connect to the Postgres database directly
```bash
docker exec -it deus-postgres psql -U postgres -d deus_restaurant_db
```

Then run SQL commands like:
```sql
\dt              -- list all tables
\d users         -- describe users table
SELECT * FROM users;
```

---

## How the Services Connect

```
Browser
  │
  ▼
deus-frontend (nginx :80)
  │
  ├── Static files (React app) ──────────────────► served directly
  │
  ├── /api/* requests ────────────────────────────► deus-backend:8080
  │
  └── /ws/* WebSocket ─────────────────────────────► deus-backend:8080
                                                          │
                                                          ▼
                                                   deus-postgres:5432
```

All three containers communicate over the `deus-network` bridge network. Container names (`deus-postgres`, `deus-backend`) act as hostnames within this network.

---

## Troubleshooting

**Backend fails to start — "Connection refused" to Postgres**
- Postgres healthcheck may not have passed yet. Wait 10–15 seconds and check:
  ```bash
  docker compose logs postgres
  ```

**Port 80 already in use**
- Another service is using port 80. Stop it or change the frontend port in `docker-compose.yml`:
  ```yaml
  ports:
    - "3000:80"   # access at http://localhost:3000
  ```

**Port 8080 already in use**
- Change the backend port mapping:
  ```yaml
  ports:
    - "9090:8080"   # access at http://localhost:9090
  ```

**Changes to code not reflected after rebuild**
- Run a forced rebuild:
  ```bash
  docker compose up -d --build --force-recreate
  ```

**View all Docker images created**
```bash
docker images | grep qr-ordering-system
```

---

## Docker Desktop

You can also manage everything visually in Docker Desktop:

1. Open **Docker Desktop**
2. Go to the **Containers** tab
3. You will see the `qr-ordering-system` stack with all 3 containers
4. Click any container to view its logs, inspect environment variables, or open a terminal inside it
5. Use the ▶ ⏹ 🔄 buttons to start, stop, or restart individual containers

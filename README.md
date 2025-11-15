# 🖊️ PenCraft – Modern Pen Store Application

PenCraft is a full-stack mini e-commerce application built with:

- **React (Frontend UI)**
- **Spring Boot (Backend API)**
- **H2 In-Memory Database**
- **Docker Compose (Container Orchestration)**

This project demonstrates how to deploy a full-stack Java + React application using **GitHub Actions**, **Docker**, and **ArgoCD**.

---

## 🚀 Features

### 🖥️ Frontend (React + Nginx)
- Clean UI for displaying pens  
- Search bar for filtering products  
- “+ Add Pen” modal to add new products  
- Fully responsive UI  
- Served using **Nginx** inside Docker  

### 🧩 Backend (Spring Boot)
- REST API for product operations  
- In-memory H2 database  
- Auto schema creation  
- Preloaded sample products  
- Exposed API: `/api/products`  

### 🐳 Docker Compose
- Backend exposed on **8080**
- Frontend exposed on **3000**
- Automatic health check for backend
- Frontend waits until backend becomes healthy

---

## 📦 Project Structure

```
root/
├── java-store/          # Spring Boot backend
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│
├── frontend/            # React UI (served by Nginx)
│   ├── src/
│   ├── Dockerfile
│   ├── styles.css
│
├── docker-compose.yml   # Multi-container orchestrator
└── README.md
```

---

## 🐳 Running the Application with Docker Compose

Make sure Docker Desktop is installed.

### 1️⃣ Build & Run the Application

```bash
docker compose up --build -d
```

This starts:

| Service      | Port                     | Description          |
|--------------|--------------------------|----------------------|
| frontend     | http://localhost:3000    | React UI (Nginx)     |
| java-store   | http://localhost:8080    | Spring Boot API      |

---

## 🌐 Access the Application

### ✔ Frontend UI  
👉 http://localhost:3000

### ✔ Backend API  
👉 http://localhost:8080/api/products

### ✔ Health Check  
👉 http://localhost:8080/actuator/health

### ✔ H2 Console  
👉 http://localhost:8080/h2-console

**JDBC URL:**
```
jdbc:h2:mem:storedb
```

---
# 🚀 How to Start the Application

Follow these steps to build and run the complete PenCraft application using **Docker Compose**.

---

## 1️⃣ Navigate to the project folder

```bash
cd ~/Desktop/Java-Projects/java-store
```

---

## 2️⃣ Build and start all services

```bash
docker compose up --build -d
```

This will start:

- Frontend → http://localhost:3000  
- Backend → http://localhost:8080  

---

## 3️⃣ Access the Application

### 🖥️ Frontend UI  
```
http://localhost:3000
```

### 🔧 Backend API  
```
http://localhost:8080/api/products
```

### 🗄️ H2 Database Console  
```
http://localhost:8080/h2-console
```

**JDBC URL**
```
jdbc:h2:mem:storedb
```

---

## 4️⃣ Stop the Application

```bash
docker compose down
```

---

## 5️⃣ Restart Without Rebuilding

```bash
docker compose up -d
```

---

## 6️⃣ Full Rebuild (recommended after code changes)

```bash
docker compose down
docker compose up --build -d
```
---
## 🛑 Stop Application

```bash
docker compose down
```

---

## 🧹 Cleanup Images (Optional)

```bash
docker rmi -f $(docker images -aq)
```

---

## ⚙ Docker Compose Overview

```yaml
version: "3.8"

services:
  java-store:
    build:
      context: ./java-store
      dockerfile: Dockerfile
    image: java-store:docker-build
    ports:
      - "8080:8080"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8080/actuator/health || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 5

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    image: java-store-frontend:latest
    ports:
      - "3000:80"
    depends_on:
      java-store:
        condition: service_healthy
    restart: unless-stopped
```

---

## 🚀 CI/CD (Optional)

Supports:
- GitHub Actions  
- ArgoCD  
- Helm Charts  

---

## 🙌 Contact  
Feel free to fork and contribute!

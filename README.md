# 🖊️ PenCraft – Modern Pen Store Application 
![Docker](https://img.shields.io/badge/Docker-✔-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)

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

# PenCraftGKE — Step-by-step Commands

This file contains step-by-step commands and instructions to: verify your "pen" entry in the current H2 in-memory setup, and two options to persist storage for `java-store` on GKE — **Option A: Cloud SQL (recommended)**, and **Option B: H2 file mode + PVC (quick demo)**. Copy–paste the commands in Cloud Shell or your terminal.

---

## Quick check: Verify the "pen" was saved (H2 in-memory)

1. List pods & services

```bash
kubectl -n pencraft-dev get pods,svc
```

2. Port-forward `java-store` service to localhost:8080 (keep this running)

```bash
kubectl -n pencraft-dev port-forward svc/java-store 8080:8080
# In a new terminal run the curl commands below
```

3. Query the API (likely path: `/api/products`)

```bash
# show list
curl -s http://localhost:8080/api/products | jq . || curl -s http://localhost:8080/api/products || true

# get single (if supported)
curl -s http://localhost:8080/api/products/1 | jq . || true
```

4. Tail backend logs while repeating the UI action (in another terminal)

```bash
kubectl -n pencraft-dev logs -f deploy/java-store --tail=200
```

5. If pod restarted after the POST, H2 memory was lost. Check restarts:

```bash
kubectl -n pencraft-dev get pods -o custom-columns=NAME:.metadata.name,RESTARTS:.status.containerStatuses[0].restartCount,AGE:.status.startTime
kubectl -n pencraft-dev get events --sort-by='.metadata.creationTimestamp' | tail -n 50
```

---

## Option A — Cloud SQL (Recommended for persistence & production)

### A.1 Create Cloud SQL instance (Postgres example)

```bash
# create instance (small tier for demo)
gcloud sql instances create pencraft-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-south1

# create database and user
gcloud sql databases create pencraft --instance=pencraft-db
gcloud sql users create appuser --instance=pencraft-db --password='ChangeMe123!'
```

> Note: replace password with a strong secret and rotate in production.

### A.2 Create a Kubernetes Secret with DB credentials

Create `secret-db.yaml`:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cloudsql-credentials
  namespace: pencraft-dev
type: Opaque
stringData:
  DB_HOST: "127.0.0.1"        # local proxy address used by the sidecar
  DB_NAME: "pencraft"
  DB_USER: "appuser"
  DB_PASS: "ChangeMe123!"
```

Apply the secret:

```bash
kubectl apply -f secret-db.yaml
```

### A.3 Create a Service Account key and store as K8s secret (for Cloud SQL Auth proxy)

1. Create a service account and grant Cloud SQL Client role:

```bash
gcloud iam service-accounts create pencraft-sql-sa --display-name="pencraft-sql-sa"
gcloud projects add-iam-policy-binding $(gcloud config get-value project) \
  --member="serviceAccount:pencraft-sql-sa@$(gcloud config get-value project).iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

2. Download key JSON (locally / Cloud Shell):

```bash
gcloud iam service-accounts keys create key.json \
  --iam-account=pencraft-sql-sa@$(gcloud config get-value project).iam.gserviceaccount.com
```

3. Create k8s secret with the key (in pencraft-dev):

```bash
kubectl create secret generic cloudsql-instance-credentials \
  --from-file=credentials.json=key.json -n pencraft-dev
```

### A.4 Patch the `java-store` deployment to add Cloud SQL Auth Proxy sidecar

Create a patch file `cloudsql-sidecar-patch.yaml` (example snippet) and apply via `kubectl patch` or update your Helm chart values.

```yaml
# cloudsql-sidecar-patch.yaml (snippet to merge into .spec.template.spec)
spec:
  template:
    spec:
      containers:
        - name: cloud-sql-proxy
          image: gcr.io/cloud-sql-connectors/cloud-sql-proxy:latest
          command:
            - "/cloud_sql_proxy"
            - "-instances=$(GCP_PROJECT):asia-south1:pencraft-db=tcp:5432"
            - "-credential_file=/secrets/cloudsql/credentials.json"
          volumeMounts:
            - name: cloudsql-instance-credentials
              mountPath: /secrets/cloudsql
              readOnly: true
      volumes:
        - name: cloudsql-instance-credentials
          secret:
            secretName: cloudsql-instance-credentials
```

Apply the patch (example uses `kubectl patch --patch` or edit via Helm values):

```bash
kubectl -n pencraft-dev patch deployment java-store --patch-file cloudsql-sidecar-patch.yaml --type=merge
```

> Alternatively, update your Helm chart `values-dev.yaml` to include the sidecar and env variables, then commit to `pencraft-gitops` and let ArgoCD deploy.

### A.5 Set Spring Boot datasource env variables (via deployment or Helm values)

Add environment variables to `java-store` deployment (use Helm values in GitOps repo):

```yaml
env:
  - name: SPRING_DATASOURCE_URL
    value: "jdbc:postgresql://127.0.0.1:5432/pencraft"
  - name: SPRING_DATASOURCE_USERNAME
    valueFrom:
      secretKeyRef:
        name: cloudsql-credentials
        key: DB_USER
  - name: SPRING_DATASOURCE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: cloudsql-credentials
        key: DB_PASS
```

After you update the chart/values, commit & push the change to your GitOps repo and sync ArgoCD.

---

## Option B — H2 file mode + PVC (Quick demo persistent storage)

> Use this for quick persistence without external Cloud SQL. Not recommended for production.

### B.1 Change Spring Boot to file-backed H2

Edit `application.properties` in your app (or set env vars via Helm values):

```
spring.datasource.url=jdbc:h2:file:/data/h2/pencraft;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE
spring.datasource.username=sa
spring.datasource.password=
```

(Add these to your Helm chart values or `ConfigMap` used by the deployment.)

### B.2 Create a PersistentVolumeClaim

Save as `h2-pvc.yaml` and apply:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: h2-pvc
  namespace: pencraft-dev
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard
```

```bash
kubectl apply -f h2-pvc.yaml
```

### B.3 Patch the `java-store` deployment to mount the PVC

Example patch snippet (merge or update via Helm values):

```yaml
spec:
  template:
    spec:
      containers:
        - name: java-store
          volumeMounts:
            - name: h2-storage
              mountPath: /data/h2
      volumes:
        - name: h2-storage
          persistentVolumeClaim:
            claimName: h2-pvc
```

Apply patch:

```bash
kubectl -n pencraft-dev patch deployment java-store --patch-file h2-mount-patch.yaml --type=merge
```

### B.4 Restart deployment and verify

```bash
kubectl -n pencraft-dev rollout restart deployment/java-store
kubectl -n pencraft-dev rollout status deployment/java-store
# port-forward and confirm data persists across pod restarts
kubectl -n pencraft-dev port-forward svc/java-store 8080:8080 &
curl -s http://localhost:8080/api/products | jq .
# restart the pod
kubectl -n pencraft-dev delete pod $(kubectl -n pencraft-dev get pods -l app=java-store -o jsonpath='{.items[0].metadata.name}')
# wait for pod to recreate and query again
curl -s http://localhost:8080/api/products | jq .
```

If the data persists after pod recreation, H2 file mode + PVC works.

---


## 🚀 CI/CD (Optional)

Supports:
- GitHub Actions  
- ArgoCD  
- Helm Charts  

---

## 🙌 Contact  
Feel free to fork and contribute!



# HostelOps

Smart Hostel Complaint & Maintenance Management System.

A minimal, production-ready full-stack web application built with a focus on core backend functionality, clean architecture, and containerization.

## Architecture & Request Flow (Production Ready)

The application utilizes a secure internal Docker network shielded behind an Nginx reverse proxy.
You can deploy this reliably on modern cloud VMs like AWS EC2. 
Only port **80 (HTTP)** and **22 (SSH)** need to be opened on your Security Groups/Firewall.

**Final Request Flow:**
`Client → Host Port 80 → Nginx (Reverse Proxy) → Backend / Frontend containers → MongoDB`

### Security and Networking Justification
- **No Direct Port Exposure**: The backend (`5000`) and frontend (`5173`) ports are NOT bound to your host machine's port. They are sealed within the Docker bridge network `hostelops-network`.
- **Nginx routing**: Nginx handles all public interface tasks. It routes `/` traffic accurately to your React static app container, and routes `/api/*` traffic to the Node instance.
- **Why is MongoDB hidden?**: Database ports are notoriously vulnerable. By retaining it strictly in an unmapped docker container, attackers cannot bruteforce it via standard internet scanning.

## Technologies

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Proxy/Web Server:** Nginx
- **Infrastructure:** Docker & Docker Compose

## Quick Start (Docker)

The fastest and most reliable way to run the application is via Docker.

1. Clone or ensure you have the project directory.
2. In the root directory (where `docker-compose.yml` is), run:
   ```bash
   docker-compose up --build -d
   ```
3. The services will start safely:
   - You can access the entire application safely on `http://localhost:80` (or `http://YOUR_AWS_PUBLIC_IP`).

## Generating the Admin Seed

To log into your app immediately and verify Admin controls, spin up the docker containers completely, and execute the backend seed command to inject a standard user.

```bash
docker exec -it hostelops-backend node seed/adminSeed.js
```

**Admin Credentials (created by seed):**
- **Email:** `admin@hostelops.com`
- **Password:** `adminpassword123`

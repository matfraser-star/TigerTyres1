# 🐯 Tiger Tyres — Full Stack Tyre Shop

A production-ready tyre shop with customer storefront, admin panel, SQLite database, image uploads and JWT auth.

---

## 🚀 Local Development

### Requirements
- Node.js 20.x ([download](https://nodejs.org/))

### Run it
```bash
cd backend && npm install
cd ../frontend && npm install && npm run build
cd ../backend && node server.js
```
Open **http://localhost:3001**

For hot-reload dev mode:
```bash
# Terminal 1
cd backend && npm start

# Terminal 2  
cd frontend && npm run dev
# Frontend at http://localhost:5173, proxies API to :3001
```

---

## 🔐 Default Login
| Username | Password |
|----------|----------|
| `tiger`  | `tiger123` |

**Change via Admin → Settings → Change Password before going live.**

---

## 🌐 Deploy to Render (Recommended)

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your repo
4. Render reads `render.yaml` automatically — just click **Deploy**
5. A `JWT_SECRET` is auto-generated for you
6. Add a **Disk** in Render dashboard: mount path `/opt/render/project/src/frontend/public/uploads` (for image uploads to persist)

**Important:** Render's free tier spins down after inactivity. Upgrade to the $7/mo plan for always-on.

---

## 🌐 Deploy to Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```
Set `JWT_SECRET` env var in the Railway dashboard.

---

## 🖥️ Deploy to VPS (Ubuntu)

```bash
# Clone repo
git clone <your-repo> /var/www/tigertyres
cd /var/www/tigertyres

# Install & build
cd backend && npm install
cd ../frontend && npm install && npm run build

# Create .env
cp .env.example .env
nano .env   # set JWT_SECRET to something long and random

# Run with PM2
npm install -g pm2
pm2 start "cd /var/www/tigertyres/backend && node server.js" --name tigertyres
pm2 save && pm2 startup
```

**Nginx config** (`/etc/nginx/sites-available/tigertyres`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/tigertyres /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
# HTTPS:
sudo certbot --nginx -d yourdomain.com
```

---

## ⚙️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `JWT_SECRET` | *(insecure default)* | **Change in production!** |
| `UPLOADS_DIR` | `frontend/public/uploads` | Image storage path |
| `DB_PATH` | `backend/tigertyres.db` | SQLite file location |

---

## 📁 Structure

```
tigertyres/
├── backend/
│   ├── server.js       # Express API + static file serving
│   ├── db.js           # SQLite init, seed data
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx     # All pages (shop, detail, admin)
│   │   ├── api.js      # Fetch wrapper
│   │   ├── ui.jsx      # Shared components
│   │   └── main.jsx
│   ├── public/uploads/ # Tyre images (persistent on disk)
│   ├── index.html
│   └── vite.config.js
├── .node-version       # Pins Node 20 for Render
├── render.yaml         # Render.com config
└── README.md
```

---

## 🛠 Tech Stack

| | |
|-|-|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express |
| Database | SQLite via better-sqlite3 v11 |
| Auth | JWT |
| Images | Multer (disk storage) |

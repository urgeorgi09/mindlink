# 🚀 MindLink+ Production Deployment Guide

## ✅ Файлове създадени:
- `.env` - обновен с production настройки
- `docker-compose.prod.yml` - production Docker конфигурация
- `init-db.sql` - PostgreSQL инициализация
- `nginx/nginx.conf` - Nginx reverse proxy
- `backup-postgres.sh` - автоматичен backup скрипт
- `backend/Dockerfile` - production backend image
- `admin-backend/Dockerfile` - production admin backend image
- `frontend/Dockerfile` - production frontend image
- `admin-frontend/Dockerfile` - production admin frontend image

## 📝 ВАЖНО: Преди deploy

### 1. Промени домейна в 3 файла:

**`.env`** (редове 20-21):
```env
VITE_API_URL=https://ТВОЯ-ДОМЕЙН.com/api
VITE_ADMIN_API_URL=https://ТВОЯ-ДОМЕЙН.com/admin/api
```

**`nginx/nginx.conf`** (редове 24, 36, 47):
```nginx
server_name ТВОЯ-ДОМЕЙН.com www.ТВОЯ-ДОМЕЙН.com;
ssl_certificate /etc/letsencrypt/live/ТВОЯ-ДОМЕЙН.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/ТВОЯ-ДОМЕЙН.com/privkey.pem;
```

### 2. Промени паролите (опционално):

В `.env` и `init-db.sql` - смени:
- `MainDB_SecurePass_2024!@#`
- `AdminDB_SecurePass_2024!@#`
- `JWT_SECRET`

## 🚀 Deployment стъпки:

### На Windows (локално):
```bash
git add .
git commit -m "Production deployment ready"
git push origin main
```

### На Ubuntu сървър:
```bash
# 1. Клонирай кода
cd /opt
sudo git clone https://github.com/ТВОЕТО-USERNAME/mindlink.git
cd mindlink

# 2. Копирай .env файла
sudo nano .env
# (копирай съдържанието от Windows .env)

# 3. Създай backups директория
sudo mkdir -p backups
sudo chmod +x backup-postgres.sh

# 4. Вземи SSL сертификат
sudo certbot certonly --standalone -d ТВОЯ-ДОМЕЙН.com -d www.ТВОЯ-ДОМЕЙН.com

# 5. Стартирай приложението
sudo docker-compose -f docker-compose.prod.yml up -d --build

# 6. Провери статуса
sudo docker-compose -f docker-compose.prod.yml ps
sudo docker-compose -f docker-compose.prod.yml logs -f
```

## 🔧 Troubleshooting:

```bash
# Статус на контейнерите
sudo docker-compose -f docker-compose.prod.yml ps

# Логове
sudo docker-compose -f docker-compose.prod.yml logs backend
sudo docker-compose -f docker-compose.prod.yml logs admin-backend
sudo docker-compose -f docker-compose.prod.yml logs postgres

# Рестарт
sudo docker-compose -f docker-compose.prod.yml down
sudo docker-compose -f docker-compose.prod.yml up -d

# Backup на базата данни
sudo ./backup-postgres.sh
```

## 📊 Очаквани URL-и:

- Main App: `https://ТВОЯ-ДОМЕЙН.com`
- Admin Panel: `https://ТВОЯ-ДОМЕЙН.com/admin`
- Main API: `https://ТВОЯ-ДОМЕЙН.com/api`
- Admin API: `https://ТВОЯ-ДОМЕЙН.com/admin/api`

## 🎉 Готово!

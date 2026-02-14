# 🚀 MindLink+ Production - Main SSL + Admin DuckDNS

## 📋 Структура:

### Main App (SSL):
- **mindlink-plus.org** → Main Frontend (HTTPS)
- **api.mindlink-plus.org** → Main Backend API (HTTPS)

### Admin Panel (DuckDNS - HTTP):
- **mindlinkadmin.duckdns.org** → Admin Frontend (HTTP)
- **mindlinkadmin.duckdns.org/api** → Admin API (HTTP)

## 📝 DNS настройки:

### 1. За mindlink-plus.org (обикновен домейн):
```
mindlink-plus.org       → SERVER_IP
www.mindlink-plus.org   → SERVER_IP
api.mindlink-plus.org   → SERVER_IP
```

### 2. За DuckDNS:
- Отиди на https://www.duckdns.org
- Създай субдомейн:
  - `mindlinkadmin` → SERVER_IP
- ⚠️ DuckDNS НЕ позволява точки в името (само A-Z, 0-9, -)

## 🚀 Deployment:

```bash
# 1. Клонирай кода
cd /opt
sudo git clone https://github.com/urgeorgi09/mindlink.git
cd mindlink

# 2. Копирай .env
sudo nano .env

# 3. Вземи SSL само за main домейна
sudo certbot certonly --standalone -d mindlink-plus.org -d www.mindlink-plus.org
sudo certbot certonly --standalone -d api.mindlink-plus.org

# 4. Стартирай
sudo docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 URL-и:

- Main App: https://mindlink-plus.org ✅ SSL
- Main API: https://api.mindlink-plus.org ✅ SSL
- Admin Panel: http://mindlinkadmin.duckdns.org ⚠️ HTTP
- Admin API: http://mindlinkadmin.duckdns.org/api ⚠️ HTTP

## ⚠️ Важно:

DuckDNS домейните работят само с HTTP (без SSL), защото Let's Encrypt не поддържа wildcard сертификати за DuckDNS без DNS challenge.

Ако искаш SSL за админ панела, трябва да използваш обикновен домейн.

## 🎉 Готово!

# 🚀 MindLink+ Production Deployment - Отделни домейни

## 📋 Структура на домейните:

- **mindlink-plus.org** → Main Frontend
- **api.mindlink-plus.org** → Main Backend API
- **admin.mindlink-plus.org** → Admin Frontend
- **api.admin.mindlink-plus.org** → Admin Backend API

## ✅ Файлове създадени:
- `.env` - обновен с отделни API URL-и
- `nginx/nginx-separate-domains.conf` - конфигурация за 4 домейна
- `docker-compose.prod.yml` - обновен да използва новата nginx конфигурация

## 📝 ВАЖНО: Преди deploy

### 1. DNS настройки

Добави A records за всички 4 домейна към IP адреса на сървъра:

```
mindlink-plus.org           → SERVER_IP
www.mindlink-plus.org       → SERVER_IP
api.mindlink-plus.org       → SERVER_IP
admin.mindlink-plus.org     → SERVER_IP
api.admin.mindlink-plus.org → SERVER_IP
```

### 2. Промени домейна в `.env`:

```env
VITE_API_URL=https://api.mindlink-plus.org
VITE_ADMIN_API_URL=https://api.admin.mindlink-plus.org
```

### 3. Промени домейна в `nginx/nginx-separate-domains.conf`:

Замени `mindlink-plus.org` с твоя домейн на 4 места:
- Ред 8, 14-15: mindlink-plus.org
- Ред 34, 40-41: api.mindlink-plus.org
- Ред 68, 74-75: admin.mindlink-plus.org
- Ред 102, 108-109: api.admin.mindlink-plus.org

## 🚀 Deployment стъпки:

### На Windows (локално):
```bash
git add .
git commit -m "Separate domains configuration"
git push origin main
```

### На Ubuntu сървър:

```bash
# 1. Клонирай кода
cd /opt
sudo git clone https://github.com/urgeorgi09/mindlink.git
cd mindlink

# 2. Копирай .env файла
sudo nano .env
# (копирай съдържанието от Windows .env)

# 3. Създай backups директория
sudo mkdir -p backups
sudo chmod +x backup-postgres.sh

# 4. Вземи SSL сертификати за ВСИЧКИ 4 домейна
sudo certbot certonly --standalone -d mindlink-plus.org -d www.mindlink-plus.org
sudo certbot certonly --standalone -d api.mindlink-plus.org
sudo certbot certonly --standalone -d admin.mindlink-plus.org
sudo certbot certonly --standalone -d api.admin.mindlink-plus.org

# 5. Стартирай приложението
sudo docker-compose -f docker-compose.prod.yml up -d --build

# 6. Провери статуса
sudo docker-compose -f docker-compose.prod.yml ps
sudo docker-compose -f docker-compose.prod.yml logs -f nginx
```

## 🔧 Troubleshooting:

```bash
# Статус на контейнерите
sudo docker-compose -f docker-compose.prod.yml ps

# Логове
sudo docker-compose -f docker-compose.prod.yml logs nginx
sudo docker-compose -f docker-compose.prod.yml logs backend
sudo docker-compose -f docker-compose.prod.yml logs admin-backend

# Тест на nginx конфигурацията
sudo docker exec mindlink-nginx nginx -t

# Рестарт
sudo docker-compose -f docker-compose.prod.yml restart nginx

# Пълен рестарт
sudo docker-compose -f docker-compose.prod.yml down
sudo docker-compose -f docker-compose.prod.yml up -d

# Backup на базата данни
sudo ./backup-postgres.sh
```

## 📊 Очаквани URL-и:

- **Main App**: https://mindlink-plus.org
- **Main API**: https://api.mindlink-plus.org
- **Admin Panel**: https://admin.mindlink-plus.org
- **Admin API**: https://api.admin.mindlink-plus.org

## 🎯 Предимства на отделните домейни:

✅ По-чист URL структура
✅ Независими SSL сертификати
✅ По-лесно rate limiting
✅ По-добра изолация между main и admin
✅ По-лесно CORS управление

## 🎉 Готово!

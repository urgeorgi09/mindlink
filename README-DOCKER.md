# 🐳 Docker Инструкции

## Стартиране на целия проект

```bash
docker-compose up --build
```

## Какво стартира:

### 📦 База данни (PostgreSQL)
- **Port**: 5432
- **Databases**: `mindlink` + `mindlink_admin`
- **User**: postgres
- **Password**: 050310

### 🟢 Основен проект
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Database**: mindlink

### 🔴 Админ проект
- **Backend**: http://localhost:5001
- **Frontend**: http://localhost:5174
- **Database**: mindlink_admin

## Команди

```bash
# Стартиране
docker-compose up

# Стартиране с rebuild
docker-compose up --build

# Спиране
docker-compose down

# Спиране + изтриване на volumes
docker-compose down -v

# Преглед на логове
docker-compose logs -f

# Преглед на логове за конкретен сървис
docker-compose logs -f backend
docker-compose logs -f admin-backend
```

## Синхронизация на данни

Админ панелът автоматично събира данни от основния проект чрез:
```
GET http://localhost:5001/api/sync/main-data
```

Това извиква основния backend и копира всички данни в админ базата.

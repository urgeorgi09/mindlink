# Локално стартиране на MindLink+

## Предварителни изисквания

1. **Node.js** (v18+)
2. **PostgreSQL** (v14+)
3. **npm** (v9+)

## Стъпки за стартиране

### 1. Стартирайте PostgreSQL

Уверете се, че PostgreSQL е стартиран на порт 5432 с:
- Database: `mindlink`
- User: `postgres`
- Password: `password`

Ако базата не съществува, създайте я:
```sql
CREATE DATABASE mindlink;
```

### 2. Инсталирайте зависимости

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Конфигурирайте .env файла

Проверете `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mindlink
DB_USER=postgres
DB_PASSWORD=password
PORT=5000
JWT_SECRET=Ivet_is_the_best_12034
```

### 4. Стартирайте приложението

**Опция 1: Автоматично (препоръчително)**
```bash
start-local.bat
```

**Опция 2: Ръчно**

Терминал 1 - Backend:
```bash
cd backend
npm start
```

Терминал 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Отворете браузър

Frontend: http://localhost:5173
Backend API: http://localhost:5000/api

## Тестови акаунти

- **User**: user@test.com / test123
- **Therapist**: therapist@test.com / test123
- **Admin**: admin@test.com / test123

## Проблеми?

### PostgreSQL не е стартиран
```bash
# Windows - стартирайте PostgreSQL service
net start postgresql-x64-14
```

### Backend не се свързва с базата
- Проверете дали PostgreSQL е на порт 5432
- Проверете username/password в .env
- Проверете дали базата `mindlink` съществува

### Frontend не вижда Backend
- Проверете дали Backend е на порт 5000
- Проверете vite.config.js proxy настройките
- Рестартирайте Frontend dev server

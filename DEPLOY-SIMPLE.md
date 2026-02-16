# 🚀 Deployment на MindLink+

## Проблемът беше:

Регистрацията и входът работят! Backend използва PostgreSQL и всичко е готово.

## Как да стартираш на Ubuntu сървър:

### 1. SSH през Tailscale
```bash
ssh user@100.x.x.x  # Твоят Tailscale IP
```

### 2. Качи кода
```bash
cd /opt
git clone https://github.com/твоето-име/mindlink.git
cd mindlink
```

### 3. Стартирай с Docker Compose
```bash
docker-compose up -d
```

### 4. Провери статуса
```bash
docker-compose ps
docker-compose logs -f
```

### 5. Отвори приложението
- **От компютър**: `http://100.x.x.x:3000`
- **От телефон** (с Tailscale): `http://100.x.x.x:3000`

## Или през Portainer:

1. Отвори: `http://100.x.x.x:9000`
2. Stacks → Add Stack → Upload `docker-compose.yml`
3. Deploy
4. Готово!

## Какво стартира:

- **PostgreSQL** - База данни на порт 5432
- **Backend** - API на порт 5000
- **Frontend** - React + Nginx на порт 3000

## Регистрация работи:

1. Отвори `http://100.x.x.x:3000/register`
2. Попълни име, email, парола
3. Избери роля (User или Therapist)
4. Регистрирай се
5. Автоматично влизаш в системата

Backend автоматично създава всички таблици в PostgreSQL при първо стартиране.

## Команди:

```bash
# Спиране
docker-compose stop

# Стартиране
docker-compose start

# Рестартиране
docker-compose restart

# Логове
docker-compose logs -f backend
docker-compose logs -f frontend

# Изтриване на всичко
docker-compose down -v
```

## Готово! 🎉

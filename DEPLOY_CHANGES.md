# 🚀 Deploy промените на Ubuntu сървъра

## Стъпка 1: SSH към сървъра

```bash
ssh user@your-server-ip
```

## Стъпка 2: Отиди в проекта

```bash
cd /path/to/mindlink
```

## Стъпка 3: Pull промените от Git

```bash
git pull origin main
```

## Стъпка 4: Rebuild и рестартирай Docker контейнерите

### Вариант А: Rebuild само frontend (по-бързо)

```bash
docker-compose up -d --build --no-deps frontend
```

### Вариант Б: Rebuild всичко (ако има промени и в backend)

```bash
docker-compose down
docker-compose up -d --build
```

### Вариант В: Force rebuild (ако кешът прави проблеми)

```bash
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

## Стъпка 5: Провери дали работи

```bash
# Виж логовете
docker-compose logs -f frontend

# Провери статуса
docker-compose ps
```

## Стъпка 6: Тествай в браузъра

Отвори: https://mindlink-plus.org

Направи **Hard Refresh**:
- Windows: `Ctrl + Shift + R` или `Ctrl + F5`
- Mac: `Cmd + Shift + R`

---

## 🔥 Бързи команди (copy-paste)

### Само frontend rebuild:
```bash
cd /path/to/mindlink && git pull && docker-compose up -d --build --no-deps frontend
```

### Пълен rebuild:
```bash
cd /path/to/mindlink && git pull && docker-compose down && docker-compose up -d --build
```

### Провери логове:
```bash
docker-compose logs -f frontend | tail -50
```

---

## ⚠️ Ако има проблеми:

### Изчисти Docker кеша:
```bash
docker system prune -a
docker-compose build --no-cache
docker-compose up -d
```

### Провери дали файловете са обновени:
```bash
docker exec -it mindlink-frontend-1 ls -la /usr/share/nginx/html/
```

### Рестартирай Nginx:
```bash
docker-compose restart frontend
```

---

## 📝 Какво се случва:

1. **git pull** - Изтегля новите промени от GitHub
2. **docker-compose build** - Rebuild-ва Docker image с новите файлове
3. **docker-compose up -d** - Стартира контейнерите в background
4. **--no-cache** - Игнорира кеша (ако има проблеми)
5. **--no-deps** - Rebuild само конкретния сервис без dependencies

---

## ✅ Готово!

След като изпълниш командите, промените ще са live на:
**https://mindlink-plus.org**

Не забравяй **Hard Refresh** в браузъра! 🔄

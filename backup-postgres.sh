#!/bin/bash
BACKUP_DIR="/opt/mindlink/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup на главната база
docker exec mindlink-postgres pg_dump -U mindlink_user mindlink_main > "$BACKUP_DIR/main_backup_$DATE.sql"

# Backup на админ базата
docker exec mindlink-postgres pg_dump -U mindlink_admin mindlink_admin > "$BACKUP_DIR/admin_backup_$DATE.sql"

# Пази само последните 7 дни
find $BACKUP_DIR -name "*_backup_*.sql" -mtime +7 -delete

echo "PostgreSQL backups completed: $DATE"

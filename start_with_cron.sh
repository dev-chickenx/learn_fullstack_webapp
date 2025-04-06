#!/bin/bash

# Docker Composeを起動
docker compose -f docker-compose.yml up -d

# 環境変数を設定
export $(grep -v '^#' .env | xargs)

# バックエンドコンテナにcronの設定を追加
docker compose exec backend bash -c "echo '*/3 * * * * cd /app && .venv/bin/python /app/app/batch/imem_batch.py >> /var/log/cron.log 2>&1' > /etc/cron.d/imem-cron"
docker compose exec backend bash -c "chmod 0644 /etc/cron.d/imem-cron"
docker compose exec backend bash -c "crontab /etc/cron.d/imem-cron"
docker compose exec backend bash -c "service cron start"

echo "Setup completed. Cron job is running."

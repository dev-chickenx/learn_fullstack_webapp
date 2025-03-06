#!/bin/bash

# 環境変数を設定
export USERNAME=admin
export PASSWORD=changethis
export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)
export DOMAIN=${DOMAIN:-"192.168.1.100"}
export EMAIL=admin@example.com

# Traefik用のネットワークを作成
echo "Traefik用のネットワークを作成しています..."
docker network create traefik-public || true

# Traefikを起動
echo "Traefikを起動しています..."
docker compose -f docker-compose.traefik.simple.yml up -d

# アプリケーションを起動
echo "アプリケーションを起動しています..."
docker compose -f docker-compose.simple.yml up -d

echo "環境の起動が完了しました"
echo "以下のURLでアクセスできます:"
echo "- Traefik: http://traefik.${DOMAIN}"
echo "- API: http://api.${DOMAIN}"
echo "- Dashboard: http://dashboard.${DOMAIN}"
echo "- Adminer: http://adminer.${DOMAIN}"
echo ""
echo "Traefik管理画面のログイン情報:"
echo "ユーザー名: ${USERNAME}"
echo "パスワード: ${PASSWORD}"

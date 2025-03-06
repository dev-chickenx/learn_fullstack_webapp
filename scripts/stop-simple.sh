#!/bin/bash

# 環境変数を設定
export USERNAME=admin
export PASSWORD=changethis
export HASHED_PASSWORD=$(openssl passwd -apr1 $PASSWORD)
export DOMAIN=${DOMAIN:-"192.168.1.100"}  # 実際のIPアドレスに合わせて変更

# アプリケーションを停止
echo "アプリケーションを停止しています..."
docker compose -f docker-compose.simple.yml down

# Traefikを停止
echo "Traefikを停止しています..."
docker compose -f docker-compose.traefik.simple.yml down

echo "環境の停止が完了しました"

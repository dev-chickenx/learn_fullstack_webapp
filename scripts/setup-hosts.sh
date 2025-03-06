#!/bin/bash

# このスクリプトは管理者権限で実行する必要があります
# sudo ./setup-hosts.sh

# 設定するIPアドレス
IP=${1:-"192.168.1.100"}

# ドメイン名
DOMAIN=${2:-"192.168.1.100"}

# ホストファイルのパス
HOSTS_FILE="/etc/hosts"

# サブドメインのリスト
SUBDOMAINS=("traefik" "api" "dashboard" "adminer")

# バックアップを作成
cp $HOSTS_FILE "${HOSTS_FILE}.bak"

echo "ホストファイルのバックアップを作成しました: ${HOSTS_FILE}.bak"

# 既存のエントリを削除
for SUBDOMAIN in "${SUBDOMAINS[@]}"; do
  sed -i "/${SUBDOMAIN}.${DOMAIN}/d" $HOSTS_FILE
done

# 新しいエントリを追加
for SUBDOMAIN in "${SUBDOMAINS[@]}"; do
  echo "$IP ${SUBDOMAIN}.${DOMAIN}" >> $HOSTS_FILE
  echo "追加: $IP ${SUBDOMAIN}.${DOMAIN}"
done

echo "ホストファイルの更新が完了しました"
echo "以下のURLでアクセスできます:"
echo "- Traefik: http://traefik.${DOMAIN}"
echo "- API: http://api.${DOMAIN}"
echo "- Dashboard: http://dashboard.${DOMAIN}"
echo "- Adminer: http://adminer.${DOMAIN}"

#!/bin/bash

# 環境変数の設定
export PYTHONPATH=/app

# ログディレクトリの作成（存在しない場合）
mkdir -p /var/log/app

# 実行時刻のログ
echo "[$(date)] Starting cron job" >> /var/log/app/cron.log

# Pythonスクリプトの実行
python3 /app/app/cron/run_scheduled_task.py >> /var/log/app/cron.log 2>&1

# 実行結果のログ
echo "[$(date)] Cron job completed with exit code $?" >> /var/log/app/cron.log

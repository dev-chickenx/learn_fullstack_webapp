#!/bin/bash

# エラーが発生した場合にスクリプトを終了
set -e

# cronの設定を読み込み
crontab /etc/cron.d/app-cron

# cronをフォアグラウンドで実行
/usr/sbin/cron -f &
CRON_PID=$!

# FastAPIを起動
fastapi run --workers 4 app/main.py &
FASTAPI_PID=$!

# プロセスの終了を待機
trap "kill $CRON_PID $FASTAPI_PID" SIGTERM SIGINT
wait

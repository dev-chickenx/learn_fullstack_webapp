import os
import sys
from datetime import datetime


def main():
    try:
        # 現在時刻を出力
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{current_time}] This is a test message from scheduled task")

        # 成功時の終了コード
        sys.exit(0)
    except Exception as e:
        print(f"Error occurred: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()

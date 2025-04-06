import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    filename="/var/log/cron.log",
)
logger = logging.getLogger(__name__)


def test_log():
    try:
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        logger.info(f"Test batch executed at {current_time}")
        print(f"Test batch executed at {current_time}")
    except Exception as e:
        logger.error(f"Error in test batch: {str(e)}")
        print(f"Error in test batch: {str(e)}")


if __name__ == "__main__":
    test_log()

import logging

logging.basicConfig(
    level=logging.INFO,   
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("app.log"), # save log
        logging.StreamHandler()     # show in console
    ]
)

logger = logging.getLogger(__name__)
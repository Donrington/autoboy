import logging
import os
from datetime import datetime


def setup_logger(name="app", level=logging.INFO, log_to_file=True, log_dir="logs"):
    """
    Set up a logger with console and optional file output.
    
    Args:
        name (str): Logger name
        level: Logging level (INFO, DEBUG, WARNING, ERROR, CRITICAL)
        log_to_file (bool): Whether to log to file
        log_dir (str): Directory for log files
    
    Returns:
        logging.Logger: Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)
    
    if logger.handlers:
        return logger
    
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    if log_to_file:
        os.makedirs(log_dir, exist_ok=True)
        log_filename = f"{name}_{datetime.now().strftime('%Y%m%d')}.log"
        log_filepath = os.path.join(log_dir, log_filename)
        
        file_handler = logging.FileHandler(log_filepath)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger


def get_logger(name="app"):
    """Get or create a logger instance."""
    return logging.getLogger(name)
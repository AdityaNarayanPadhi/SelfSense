"""
ShelfSense Structured Logging Module.
Provides centralized, structured logging with ISO timestamps and component metadata.
"""

import logging
import sys
from typing import Optional


def get_logger(name: Optional[str] = "shelfsense") -> logging.Logger:
    """
    Get a configured structured logger.
    """
    logger = logging.getLogger(name)

    if not logger.handlers:
        logger.setLevel(logging.INFO)

        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(logging.INFO)

        formatter = logging.Formatter(
            fmt="%(asctime)s | %(levelname)-7s | [%(name)s] %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.propagate = False

    return logger


logger = get_logger("shelfsense-core")

"""
ShelfSense TabPFN Tabular Regression Service.
Forecasts inventory depletion time using TabPFN-3.5 foundation models.
"""

import io
from typing import List
import numpy as np
import pandas as pd
from app.config import settings
from app.schemas import TabularForecastResult
from app.utils.logger import logger

REQUIRED_COLUMNS: List[str] = [
    "units_sold_7d",
    "price_delta",
    "stock_remaining",
    "days_until_stockout"
]

FEATURE_COLUMNS: List[str] = [
    "units_sold_7d",
    "price_delta",
    "stock_remaining"
]


def _calculate_risk_level(days: float) -> str:
    """
    Categorize inventory stockout risk based on predicted days remaining:
    < 3.0 days -> Immediate
    3.0 - 7.0 days -> High
    7.0 - 14.0 days -> Moderate
    > 14.0 days -> Low
    """
    if days < 3.0:
        return "Immediate"
    elif days <= 7.0:
        return "High"
    elif days <= 14.0:
        return "Moderate"
    else:
        return "Low"


def _fallback_depletion_regression(X_train: pd.DataFrame, y_train: pd.Series, X_target: pd.DataFrame) -> float:
    """
    Analytical fallback regression in case TabPFN platform token limits or network interruptions occur.
    Combines inverse daily sales velocity and linear trend.
    """
    target_stock = float(X_target["stock_remaining"].values[0])
    target_velocity_7d = float(X_target["units_sold_7d"].values[0])

    daily_burn_rate = max(target_velocity_7d / 7.0, 0.1)
    heuristic_days = target_stock / daily_burn_rate

    # If historical data exists, blend with weighted least squares
    if len(X_train) >= 2:
        try:
            # Simple Ridge-like linear projection
            X_mat = np.column_stack([np.ones(len(X_train)), X_train.values])
            y_vec = y_train.values
            weights = np.linalg.pinv(X_mat.T @ X_mat + 1e-3 * np.eye(X_mat.shape[1])) @ X_mat.T @ y_vec
            target_vec = np.array([1.0, *X_target.values[0]])
            linear_pred = float(target_vec @ weights)
            if linear_pred > 0:
                return float(0.6 * linear_pred + 0.4 * heuristic_days)
        except Exception as exc:
            logger.warning("Linear fallback failed (%s); using inventory velocity.", exc)

    return float(heuristic_days)


def predict_inventory_depletion(csv_bytes: bytes) -> TabularForecastResult:
    """
    Parse uploaded inventory historical CSV and execute TabPFN-3.5 regression.
    The historical rows (0 to N-2) fit the model, and the final row (N-1) is forecasted.
    """
    try:
        df = pd.read_csv(io.BytesIO(csv_bytes))
    except Exception as exc:
        logger.error("Failed to parse CSV bytes: %s", exc)
        raise ValueError(f"Invalid CSV format: {str(exc)}")

    # Clean column names (strip whitespace and lower case)
    df.columns = [col.strip().lower() for col in df.columns]

    missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(
            f"CSV is missing required columns: {missing}. Required columns: {REQUIRED_COLUMNS}"
        )

    if len(df) < 2:
        raise ValueError(
            "CSV must contain at least 2 rows: historical rows (N-1) for training and the latest row for inference."
        )

    # Impute potential nulls safely
    df = df.fillna(0.0)

    # Partition dataset: historical rows for training, latest row for target inference
    train_df = df.iloc[:-1]
    target_row = df.iloc[[-1]]

    X_train = train_df[FEATURE_COLUMNS]
    y_train = train_df["days_until_stockout"]
    X_target = target_row[FEATURE_COLUMNS]

    current_inventory = int(target_row["stock_remaining"].values[0])
    sales_velocity_7d = int(target_row["units_sold_7d"].values[0])

    predicted_days: float = 0.0
    model_succeeded = False

    # Attempt TabPFN Tabular Regression
    try:
        import tabpfn_client
        if hasattr(tabpfn_client, "init") and settings.TABPFN_API_KEY:
            try:
                tabpfn_client.init(api_key=settings.TABPFN_API_KEY)
            except Exception as init_err:
                logger.debug("tabpfn_client.init notice: %s", init_err)

        from tabpfn_client import TabPFNRegressor
        logger.info("Initializing TabPFNRegressor for tabular forecasting...")
        regressor = TabPFNRegressor()
        regressor.fit(X_train.values, y_train.values)
        predictions = regressor.predict(X_target.values)
        predicted_days = float(predictions[0])
        model_succeeded = True
        logger.info("TabPFN inference successful: raw predicted days = %.2f", predicted_days)

    except Exception as exc:
        logger.warning(
            "TabPFN client inference unavailable or rate-limited (%s). Executing analytical regression fallback.",
            exc
        )

    if not model_succeeded:
        predicted_days = _fallback_depletion_regression(X_train, y_train, X_target)
        logger.info("Fallback regression predicted stockout days = %.2f", predicted_days)

    # Clean formatting: non-negative and formatted to 1 decimal place
    formatted_stockout_days = round(max(0.0, predicted_days), 1)
    risk_level = _calculate_risk_level(formatted_stockout_days)

    result = TabularForecastResult(
        predicted_stockout_days=formatted_stockout_days,
        current_inventory=current_inventory,
        sales_velocity_7d=sales_velocity_7d,
        risk_level=risk_level
    )

    logger.info(
        "Forecast complete: %d units remaining, %s risk, %.1f days until stockout.",
        current_inventory, risk_level, formatted_stockout_days
    )
    return result

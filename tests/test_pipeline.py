"""
ShelfSense Pipeline Integration Tests.
Validates synthetic tabular dataset forecasting, API response validation, and audio streaming.
"""

import io
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.tabpfn_service import predict_inventory_depletion


client = TestClient(app)


def create_synthetic_inventory_csv(n_rows: int = 5) -> bytes:
    """
    Creates an in-memory 5-row synthetic CSV with required schema:
    units_sold_7d, price_delta, stock_remaining, days_until_stockout
    """
    header = "units_sold_7d,price_delta,stock_remaining,days_until_stockout\n"
    # Historical rows + latest current row
    rows = [
        "14,0.0,42,21.0\n",
        "18,-2.5,35,13.6\n",
        "25,3.0,24,6.7\n",
        "30,5.0,12,2.8\n",
        "28,4.5,8,2.0\n"  # Target row for prediction
    ]
    csv_text = header + "".join(rows[:n_rows])
    return csv_text.encode("utf-8")


def test_health_check():
    """Verify health endpoint returns status 200 and correct service identifier."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "shelfsense-api"


def test_tabpfn_service_direct():
    """Directly test the tabular forecast module with synthetic CSV data."""
    csv_bytes = create_synthetic_inventory_csv(5)
    forecast = predict_inventory_depletion(csv_bytes)

    assert forecast.current_inventory == 8
    assert forecast.sales_velocity_7d == 28
    assert forecast.predicted_stockout_days >= 0.0
    assert forecast.risk_level in ["Immediate", "High", "Moderate", "Low"]
    # Check that decimal is formatted to 1 decimal place
    assert str(forecast.predicted_stockout_days).replace(".", "").isdigit()


def test_tabpfn_invalid_columns():
    """Verify that CSV with missing columns raises ValueError."""
    bad_csv = b"col1,col2,col3\n1,2,3\n4,5,6"
    with pytest.raises(ValueError, match="CSV is missing required columns"):
        predict_inventory_depletion(bad_csv)


def test_api_analyze_pipeline_integration():
    """
    Test the full end-to-end /api/analyze pipeline.
    Sends product_query and synthetic CSV file via multipart/form-data.
    """
    csv_bytes = create_synthetic_inventory_csv(5)
    files = {
        "csv_file": ("test_inventory.csv", io.BytesIO(csv_bytes), "text/csv")
    }
    data = {
        "product_query": "Sony WH-1000XM5 Wireless Headphones"
    }

    response = client.post("/api/analyze", data=data, files=files)
    assert response.status_code == 200, f"Error: {response.text}"

    body = response.json()

    # Validate high-level contract
    assert body["product_query"] == "Sony WH-1000XM5 Wireless Headphones"
    assert "forecast" in body
    assert "competitors" in body
    assert "strategy" in body
    assert "audio_url" in body

    # Validate forecast sub-object
    forecast = body["forecast"]
    assert "predicted_stockout_days" in forecast
    assert forecast["current_inventory"] == 8
    assert forecast["sales_velocity_7d"] == 28
    assert forecast["risk_level"] in ["Immediate", "High", "Moderate", "Low"]

    # Validate competitors array
    competitors = body["competitors"]
    assert isinstance(competitors, list)
    assert len(competitors) > 0
    first_comp = competitors[0]
    assert "title" in first_comp
    assert "price" in first_comp
    assert "source" in first_comp
    assert "in_stock" in first_comp

    # Validate strategy payload
    strategy = body["strategy"]
    assert "suggested_price_delta_percent" in strategy
    assert "new_suggested_price" in strategy
    assert len(strategy["ad_headlines"]) == 3
    # Check that each ad headline is under 30 characters
    for headline in strategy["ad_headlines"]:
        assert len(headline) <= 30, f"Headline '{headline}' exceeded 30 characters"
    assert len(strategy["action_steps"]) >= 1
    assert len(strategy["spoken_script"]) > 20
    # Spoken script should not contain markdown asterisks
    assert "*" not in strategy["spoken_script"]

    # Validate audio streaming URL
    audio_url = body["audio_url"]
    assert audio_url.startswith("/audio/")
    assert audio_url.endswith(".mp3")

    # Verify audio file is streamable via GET /audio/{filename}
    filename = audio_url.replace("/audio/", "")
    audio_res = client.get(f"/audio/{filename}")
    assert audio_res.status_code == 200
    assert audio_res.headers["content-type"] == "audio/mpeg"


def test_api_analyze_rejects_non_csv():
    """Verify that uploading a non-CSV file returns 400 Bad Request."""
    files = {
        "csv_file": ("test.txt", io.BytesIO(b"hello world"), "text/plain")
    }
    data = {
        "product_query": "Apple AirPods Pro"
    }

    response = client.post("/api/analyze", data=data, files=files)
    assert response.status_code == 400
    assert "Invalid file format" in response.json()["detail"]


def test_audio_endpoint_404():
    """Verify that non-existent audio file returns 404."""
    response = client.get("/audio/non_existent_file_99999.mp3")
    assert response.status_code == 404

"""
ShelfSense FastAPI Main Application Entrypoint.
Orchestrates TabPFN-3.5 regression, SerpApi shopping crawling, Gemma reasoning, and ElevenLabs audio briefs.
"""

import asyncio
from pathlib import Path
import uuid
from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.schemas import AnalysisResponse, HealthResponse
from app.services.audio_service import STATIC_AUDIO_DIR, generate_morning_brief
from app.services.gemma_service import generate_arbitrage_playbook
from app.services.serp_service import get_live_competitor_listings
from app.services.tabpfn_service import predict_inventory_depletion
from app.utils.logger import logger

# Initialize FastAPI application
app = FastAPI(
    title="ShelfSense Engine",
    description="E-commerce inventory arbitrage and stockout detection engine for Shopify and Amazon sellers.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable Cross-Origin Resource Sharing (CORS) for Next.js / Vercel frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure static audio output directory exists
STATIC_AUDIO_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/health", response_model=HealthResponse, tags=["Monitoring"])
async def health_check():
    """
    Service health check probe.
    """
    return HealthResponse(status="ok", service="shelfsense-api")


@app.get("/", tags=["Monitoring"])
async def root_index():
    """
    Root informational endpoint.
    """
    return {
        "service": "ShelfSense Intelligence Engine",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/audio/{filename}", tags=["Audio"])
async def stream_audio(filename: str):
    """
    Stream or download generated ElevenLabs 60s morning brief MP3.
    """
    file_path = STATIC_AUDIO_DIR / filename
    if not file_path.is_file():
        logger.warning("Requested audio file not found: %s", filename)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Audio file '{filename}' was not found."
        )

    return FileResponse(
        path=file_path,
        media_type="audio/mpeg",
        filename=filename
    )


@app.post(
    "/api/analyze",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    tags=["Arbitrage Pipeline"]
)
async def analyze_product_inventory(
    product_query: str = Form(..., description="Product query, title, or ASIN to monitor"),
    csv_file: UploadFile = File(..., description="Historical inventory depletion CSV file")
):
    """
    Execute full ShelfSense arbitrage pipeline:
    1. Parse and validate merchant inventory CSV.
    2. Run TabPFN-3.5 tabular regression to forecast stockout timeline.
    3. Concurrently crawl real-time competitor prices & stock status via SerpApi.
    4. Pass intelligence into Google Gemma to synthesize pricing rules and ad copy.
    5. Synthesize 60-second spoken brief via ElevenLabs TTS API.
    """
    run_id = str(uuid.uuid4())
    logger.info("Initiating ShelfSense analysis run_id=%s for query='%s'", run_id, product_query)

    # Validate file extension
    if not csv_file.filename or not csv_file.filename.lower().endswith(".csv"):
        logger.warning("Uploaded file is not a CSV: %s", csv_file.filename)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Uploaded file must be a valid .csv file."
        )

    # Read CSV content into memory
    try:
        csv_bytes = await csv_file.read()
        if not csv_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded CSV file is empty."
            )
    except Exception as read_err:
        logger.error("Failed to read uploaded file: %s", read_err)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error reading uploaded file: {str(read_err)}"
        )

    # Step 1 & 2: Concurrently execute TabPFN tabular prediction and SerpApi competitor crawling
    try:
        logger.info("Executing concurrent TabPFN forecast and SerpApi competitor crawl...")
        forecast_task = asyncio.to_thread(predict_inventory_depletion, csv_bytes)
        competitors_task = get_live_competitor_listings(product_query)

        forecast_result, competitors_result = await asyncio.gather(
            forecast_task,
            competitors_task
        )
    except ValueError as val_err:
        logger.warning("Validation error in tabular dataset: %s", val_err)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except Exception as pipeline_err:
        logger.error("Error during intelligence ingestion: %s", pipeline_err, exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Intelligence pipeline failed: {str(pipeline_err)}"
        )

    # Step 3: Gemma LLM Reasoning & Strategy Synthesis
    try:
        logger.info("Synthesizing strategic arbitrage playbook via Gemma...")
        strategy_result = await generate_arbitrage_playbook(
            product=product_query,
            forecast=forecast_result,
            competitors=competitors_result
        )
    except Exception as gemma_err:
        logger.error("Error generating strategy: %s", gemma_err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Arbitrage reasoning failed: {str(gemma_err)}"
        )

    # Step 4: ElevenLabs Morning Brief Audio Synthesis
    try:
        logger.info("Generating ElevenLabs morning audio brief...")
        audio_url = await generate_morning_brief(
            script=strategy_result.spoken_script,
            run_id=run_id
        )
    except Exception as audio_err:
        logger.error("Error generating audio brief: %s", audio_err)
        audio_url = f"/audio/{run_id}.mp3"

    logger.info("Analysis run_id=%s successfully completed.", run_id)

    return AnalysisResponse(
        product_query=product_query,
        forecast=forecast_result,
        competitors=competitors_result,
        strategy=strategy_result,
        audio_url=audio_url
    )

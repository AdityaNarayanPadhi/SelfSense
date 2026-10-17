"""
ShelfSense Gemma Reasoning & Arbitrage Synthesis Service.
Leverages Google Gemma (via Ollama or cloud endpoints) to analyze competitor stockouts,
synthesize dynamic pricing adjustments, generate ad copy, and compose a 60-word morning brief.
"""

import json
import re
from typing import List, Optional
import httpx
from app.config import settings
from app.schemas import ArbitrageStrategy, CompetitorItem, TabularForecastResult
from app.utils.logger import logger


SYSTEM_PROMPT = """You are ShelfSense's algorithmic e-commerce arbitrage director and pricing quant.
Your role is to maximize gross merchant margin and capture market share across Shopify and Amazon.

Analyze the merchant's TabPFN inventory depletion forecast and real-time competitor stock levels:
1. If competitors are stocking out or out of stock: Recommend an immediate ad budget surge (+25-50%) and a 10% to 20% price increase to capture out-of-stock arbitrage margin.
2. If competitors maintain healthy in-stock inventory: Recommend defensive discounting (-5% to -10%) or bundle campaigns to maintain Buy Box ownership and high sales velocity.
3. Generate exactly 3 punchy Google/Facebook ad headlines (each STRICTLY under 30 characters).
4. Provide 3 clear, tactical action steps for the merchant.
5. Provide a clean, natural 60-word conversational morning audio script addressing the merchant directly as their morning copilot. Do NOT use markdown, asterisks, hashtags, or bullet points in the spoken script; use natural conversational pauses and punctuation suitable for speech synthesis.

Return ONLY a valid JSON object with these exact keys:
{
  "suggested_price_delta_percent": float,
  "new_suggested_price": float,
  "ad_headlines": ["headline 1", "headline 2", "headline 3"],
  "action_steps": ["step 1", "step 2", "step 3"],
  "spoken_script": "morning audio script"
}"""


def _sanitize_ad_headlines(headlines: List[str]) -> List[str]:
    """Ensure all ad headlines are under 30 characters as required by ad networks."""
    sanitized = []
    for h in headlines:
        cleaned = re.sub(r"[\"'\*#]", "", str(h)).strip()
        if len(cleaned) > 29:
            cleaned = cleaned[:29].rstrip()
        if cleaned:
            sanitized.append(cleaned)

    # Guarantee 3 headlines
    defaults = ["In Stock & Ready To Ship", "Fast Express Delivery", "Claim Yours Before Sold Out"]
    while len(sanitized) < 3:
        sanitized.append(defaults[len(sanitized)])
    return sanitized[:3]


def _clean_spoken_script(raw_script: str) -> str:
    """Strip markdown, asterisks, and emojis to ensure crystal-clear TTS pronunciation."""
    # Remove markdown formatting like **, ##, bullet points, brackets
    cleaned = re.sub(r"[\*#_~`\[\]\(\)\{\}>]", "", raw_script)
    # Remove bullet markers at beginning of lines
    cleaned = re.sub(r"^\s*[-•\d+\.]+\s*", "", cleaned, flags=re.MULTILINE)
    # Remove double spaces and normalize newlines to natural pauses
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def _generate_rule_based_strategy(
    product: str,
    forecast: TabularForecastResult,
    competitors: List[CompetitorItem]
) -> ArbitrageStrategy:
    """
    Intelligent algorithmic fallback if Gemma inference endpoint is unreachable.
    Adheres strictly to the pricing and arbitrage rules.
    """
    logger.info("Synthesizing algorithmic arbitrage playbook for '%s'...", product)

    out_of_stock_competitors = [c for c in competitors if not c.in_stock]
    avg_competitor_price = (
        sum(c.price for c in competitors) / len(competitors)
        if competitors else 99.0
    )
    # If no price or low price, baseline
    if avg_competitor_price <= 0.0:
        avg_competitor_price = 89.99

    competitor_stockout_pressure = len(out_of_stock_competitors) >= 1 or forecast.predicted_stockout_days < 3.0

    if competitor_stockout_pressure:
        delta_percent = 15.0
        new_price = round(avg_competitor_price * (1 + delta_percent / 100.0), 2)
        ad_headlines = [
            "In Stock Now - Ships Today",
            "Official Stock Guarantee",
            "Skip The Sold Out Queues"
        ]
        action_steps = [
            f"Increase list price by {delta_percent}% to ${new_price:.2f} to capitalize on competitor stockouts.",
            "Surge Google Shopping ad budget by 35% targeting competitor out-of-stock search terms.",
            "Contact supplier immediately to expedite reorder of inventory before 7-day depletion."
        ]
        spoken_script = (
            f"Good morning. ShelfSense intelligence update for {product}. "
            f"Key competitors are currently out of stock while our inventory depletion model forecasts {forecast.predicted_stockout_days} days of runway. "
            f"We recommend increasing price by fifteen percent to {new_price:.2f} dollars and surging ad spend by thirty-five percent today. "
            f"Check your dashboard for supplier reorder triggers."
        )
    else:
        delta_percent = -5.0
        new_price = round(avg_competitor_price * (1 + delta_percent / 100.0), 2)
        ad_headlines = [
            "Lowest Price Guaranteed",
            "Exclusive Member Discount",
            "Bundle & Save 10% Today"
        ]
        action_steps = [
            f"Implement defensive dynamic pricing at ${new_price:.2f} ({abs(delta_percent)}% discount) to win the Buy Box.",
            "Launch a multi-unit bundle promotion to accelerate sales velocity beyond competitors.",
            "Maintain baseline PPC ad spend focusing on high-converting branded search keywords."
        ]
        spoken_script = (
            f"Good morning. Here is your daily inventory brief for {product}. "
            f"Competitors have healthy stock levels. TabPFN models indicate {forecast.predicted_stockout_days} days of remaining stock with {forecast.risk_level.lower()} risk. "
            f"We recommend a defensive price adjustment of five percent down to {new_price:.2f} dollars to secure the Buy Box. "
            f"Have a profitable day."
        )

    return ArbitrageStrategy(
        suggested_price_delta_percent=delta_percent,
        new_suggested_price=new_price,
        ad_headlines=_sanitize_ad_headlines(ad_headlines),
        action_steps=action_steps,
        spoken_script=_clean_spoken_script(spoken_script)
    )


async def generate_arbitrage_playbook(
    product: str,
    forecast: TabularForecastResult,
    competitors: List[CompetitorItem]
) -> ArbitrageStrategy:
    """
    Synthesize strategic arbitrage playbook via Google Gemma (Ollama or Cloud Endpoint).
    Falls back gracefully to algorithmic quant rules if endpoint is not reachable.
    """
    competitors_summary = "\n".join([
        f"- {c.source}: ${c.price:.2f} | In Stock: {c.in_stock} | Rating: {c.rating or 'N/A'}"
        for c in competitors
    ])

    user_prompt = f"""Product: {product}
Internal Inventory Forecast:
- Predicted Stockout: {forecast.predicted_stockout_days} days
- Current Stock: {forecast.current_inventory} units
- 7-Day Velocity: {forecast.sales_velocity_7d} units sold
- Risk Category: {forecast.risk_level}

Real-time Competitor Listings:
{competitors_summary}

Synthesize your pricing arbitrage decision, 3 ad headlines (<30 chars), action steps, and 60-word morning script in JSON."""

    # Attempt connection to Gemma via Ollama or HTTP API
    try:
        base_url = settings.GEMMA_API_BASE.rstrip("/")
        # Try Ollama /api/chat or OpenAI-compatible /v1/chat/completions
        ollama_endpoint = f"{base_url}/api/chat"
        payload = {
            "model": settings.GEMMA_MODEL_NAME,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "stream": False,
            "format": "json"
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            logger.info("Invoking Gemma LLM model '%s' at %s...", settings.GEMMA_MODEL_NAME, ollama_endpoint)
            response = await client.post(ollama_endpoint, json=payload)

            if response.status_code == 200:
                data = response.json()
                content = data.get("message", {}).get("content", "")
                parsed = json.loads(content)

                return ArbitrageStrategy(
                    suggested_price_delta_percent=float(parsed.get("suggested_price_delta_percent", 10.0)),
                    new_suggested_price=float(parsed.get("new_suggested_price", 99.99)),
                    ad_headlines=_sanitize_ad_headlines(parsed.get("ad_headlines", [])),
                    action_steps=parsed.get("action_steps", ["Monitor inventory", "Adjust ad bids"]),
                    spoken_script=_clean_spoken_script(parsed.get("spoken_script", ""))
                )
            else:
                logger.warning(
                    "Gemma endpoint returned status %d. Falling back to rule-based engine.",
                    response.status_code
                )
    except Exception as exc:
        logger.info("Gemma LLM service unavailable or skipped (%s). Using algorithmic synthesis.", exc)

    return _generate_rule_based_strategy(product, forecast, competitors)

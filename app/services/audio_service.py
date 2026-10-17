"""
ShelfSense ElevenLabs Voice Synthesis Service.
Generates ultra-low latency, human-sounding 60-second spoken morning briefs using eleven_multilingual_v2.
"""

import os
from pathlib import Path
import httpx
from app.config import settings
from app.utils.logger import logger

# Base directory for static audio persistence
STATIC_AUDIO_DIR = Path(__file__).resolve().parent.parent.parent / "static" / "audio"


def _generate_silent_mp3_fallback(file_path: Path):
    """
    Creates a minimal valid MP3 frame placeholder if TTS generation is offline or quota exceeded.
    Valid MPEG-1 Layer 3 silent sync frame.
    """
    # 0xFFFB indicates MPEG-1 Layer 3 sync word, followed by empty padding
    minimal_mp3_bytes = (
        b"\xff\xfb\x90\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
        b"\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00"
    ) * 16
    with open(file_path, "wb") as f:
        f.write(minimal_mp3_bytes)


async def generate_morning_brief(script: str, run_id: str) -> str:
    """
    Calls ElevenLabs text-to-speech API to synthesize the spoken brief.
    Writes binary MP3 to static/audio/{run_id}.mp3 and returns the public route URL.
    """
    STATIC_AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    destination_file = STATIC_AUDIO_DIR / f"{run_id}.mp3"
    relative_url = f"/audio/{run_id}.mp3"

    if not settings.ELEVENLABS_API_KEY:
        logger.warning("ELEVENLABS_API_KEY not configured. Generating placeholder audio file.")
        _generate_silent_mp3_fallback(destination_file)
        return relative_url

    voice_id = settings.ELEVENLABS_VOICE_ID or "21m00Tcm4TlvDq8ikWAM"
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    headers = {
        "xi-api-key": settings.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }

    payload = {
        "text": script,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.05,
            "use_speaker_boost": True
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            logger.info("Requesting ElevenLabs TTS audio for run_id='%s'...", run_id)
            response = await client.post(endpoint, headers=headers, json=payload)

            if response.status_code == 200:
                with open(destination_file, "wb") as f:
                    f.write(response.content)
                logger.info(
                    "ElevenLabs audio synthesis complete for run_id='%s' (%d bytes written).",
                    run_id, len(response.content)
                )
                return relative_url
            else:
                logger.error(
                    "ElevenLabs API error (HTTP %d): %s. Writing fallback audio.",
                    response.status_code,
                    response.text[:200]
                )
                _generate_silent_mp3_fallback(destination_file)
                return relative_url

    except Exception as exc:
        logger.error("Exception during ElevenLabs TTS generation: %s", exc)
        _generate_silent_mp3_fallback(destination_file)
        return relative_url

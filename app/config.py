"""
ShelfSense Configuration Module.
Loads and validates application settings using pydantic-settings.
"""

from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings schema with environment variable overrides.
    """
    # SerpApi Google Shopping crawler configuration
    SERPAPI_API_KEY: str = Field(
        default="674405190933c09bdece707717ff5f3cea59b3c507acc0313add1b3be499f3a4",
        description="SerpApi private key for Google Shopping engine queries."
    )

    # TabPFN client platform configuration
    TABPFN_API_KEY: str = Field(
        default="tabpfn_sk_R0d_rAAKKjG50OEEIi36Y8qQHPEoiisv7TxN7aj3z5M",
        description="TabPFN client API key for cloud inference."
    )

    # ElevenLabs Text-to-Speech configuration
    ELEVENLABS_API_KEY: str = Field(
        default="sk_f5437d607565eea5ab0ed23d93384ba198929bf062860d55",
        description="ElevenLabs API key for voice synthesis."
    )
    ELEVENLABS_VOICE_ID: str = Field(
        default="21m00Tcm4TlvDq8ikWAM",
        description="Default voice ID for speech synthesis (Rachel)."
    )

    # Gemma LLM / Ollama configuration
    GEMMA_API_BASE: str = Field(
        default="http://localhost:11434",
        description="Base URL for Gemma inference (Ollama or cloud endpoint)."
    )
    GEMMA_MODEL_NAME: str = Field(
        default="gemma2",
        description="Gemma model variant tag."
    )

    # Server & Networking
    ALLOWED_ORIGINS: str = Field(
        default="*",
        description="Comma-separated list of permitted CORS origins."
    )
    PORT: int = Field(
        default=8000,
        description="HTTP server bind port."
    )
    BASE_URL: str = Field(
        default="http://localhost:8000",
        description="Base service URL for constructing public static URLs."
    )

    @property
    def cors_origins(self) -> List[str]:
        """Parse comma-delimited ALLOWED_ORIGINS into a clean list of URLs."""
        if not self.ALLOWED_ORIGINS or self.ALLOWED_ORIGINS.strip() == "*":
            return ["*"]
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()

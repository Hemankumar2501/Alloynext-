from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    ENV: str = "development"
    APP_NAME: str = "AlloyNext API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "alloynext-secure-dev-key-change-in-production-random-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days (1 month)

    DATABASE_URL: str = "sqlite:///./alloynext.db"

    ALLOWED_ORIGINS: Union[str, List[str]] = [
        "http://localhost:8089",
        "http://localhost:8081",
        "http://localhost:3000",
        "http://127.0.0.1:8089",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:3000",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # AI Configuration
    AI_PROVIDER: str = "mock"
    AI_API_KEY: str = ""
    AI_MODEL_NAME: str = "gemini-1.5-flash"


settings = Settings()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
import os


app = FastAPI(
    title="YAP API",
    description="Backend API for the YAP social PWA",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}


class LoginRequest(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    username: str
    full_name: str | None = None
    profile_picture_url: str | None = None
    created_at: datetime
    timezone: str


class AuthResponse(BaseModel):
    user: UserOut
    access_token: str
    refresh_token: str


TEST_EMAIL = os.getenv("YAP_TEST_EMAIL", "test@yap.app")
TEST_USERNAME = os.getenv("YAP_TEST_USERNAME", "testuser")
TEST_PASSWORD = os.getenv("YAP_TEST_PASSWORD", "Test1234!")


@app.post("/api/auth/login", response_model=AuthResponse, tags=["auth"])
async def login(payload: LoginRequest) -> AuthResponse:
    if payload.email != TEST_EMAIL or payload.password != TEST_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    now = datetime.now(timezone.utc)

    user = UserOut(
        id="00000000-0000-0000-0000-000000000001",
        email=TEST_EMAIL,
        username=TEST_USERNAME,
        full_name="Test User",
        profile_picture_url=None,
        created_at=now,
        timezone="UTC",
    )

    # For now these are simple dummy strings just to satisfy the frontend shape.
    access_token = "dev-access-token"
    refresh_token = "dev-refresh-token"

    return AuthResponse(user=user, access_token=access_token, refresh_token=refresh_token)


@app.get("/api/users/me", response_model=UserOut, tags=["users"])
async def get_me() -> UserOut:
    """
    Temporary dev endpoint that always returns the test user.
    In production this will validate the JWT from Authorization header.
    """
    now = datetime.now(timezone.utc)
    return UserOut(
        id="00000000-0000-0000-0000-000000000001",
        email=TEST_EMAIL,
        username=TEST_USERNAME,
        full_name="Test User",
        profile_picture_url=None,
        created_at=now - timedelta(days=1),
        timezone="UTC",
    )



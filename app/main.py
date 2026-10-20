from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.session import engine
from app.model.task import Task
from app.api.task import router as task_router
from app.model.user import User

# Auth
from app.api import auth

# Custom logger
from app.core.logger import logger

# Redis
from app.core.redis import redis_client


app = FastAPI()


# CORS Middleware - Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Middleware for logging requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")

    response = await call_next(request)

    logger.info(f"Response Status: {response.status_code}")

    return response


# Routers
app.include_router(task_router)
app.include_router(auth.router)


# Create database tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def home():
    return {"message": "API running"}


@app.get("/redis-test")
def redis_test():
    redis_client.set("test_key", "hello")
    value = redis_client.get("test_key")

    return {"redis_value": value}

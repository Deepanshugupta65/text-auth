from fastapi import FastAPI, Request
from app.db.base import Base
from app.db.session import engine
from app.model.task import Task
from app.api.task import router as task_router
from app.model.user import User
# auth
from app.api import auth
# custome loggwe
from app.core.logger import logger 

app = FastAPI()

# ✅ Middleware for logging requests
@app.middleware("http")
async def log_requests(request: Request, call_next):

    logger.info(f"Request: {request.method} {request.url}")

    response = await call_next(request)

    logger.info(f"Response Status: {response.status_code}")

    return response

# router 
app.include_router(task_router)
app.include_router(auth.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message":"API running"}
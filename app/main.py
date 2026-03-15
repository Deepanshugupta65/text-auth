from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from app.model.task import Task
from app.api.task import router as task_router
from app.model.user import User
# auth
from app.api import auth
app = FastAPI()


app.include_router(task_router)
app.include_router(auth.router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message":"API running"}
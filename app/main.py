from fastapi import FastAPI
from app.db.base import Base
from app.db.session import engine
from app.model.task import Task
from app.api.task import router as task_router

app = FastAPI()


app.include_router(task_router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message":"API running"}
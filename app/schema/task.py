from pydantic import BaseModel
# for update task
from typing import Optional
class TaskCreate(BaseModel):
    title: str

# for get_all_tasks
class TaskResponse(BaseModel):
    id:int
    title:str

    class Config:
        from_attributes = True

class TaskUpdate(BaseModel):
    title:Optional[str] = None
    completed:Optional[bool] = None
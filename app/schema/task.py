# from pydantic import BaseModel
# # for update task
# from typing import Optional
# class TaskCreate(BaseModel):
#     title: str

# # for get_all_tasks
# class TaskResponse(BaseModel):
#     id:int
#     title:str

#     class Config:
#         from_attributes = True

# class TaskUpdate(BaseModel):
#     title:Optional[str] = None
#     completed:Optional[bool] = None

from pydantic import BaseModel
from typing import Optional


# for create task

class TaskCreate(BaseModel):
    title: str


# for get_all_tasks

class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool
    owner_id: int

    class Config:
        from_attributes = True


# for update task

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
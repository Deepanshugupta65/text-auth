from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str

# for get_all_tasks
class TaskResponse(BaseModel):
    id:int
    title:str

    class Config:
        from_attributes = True
from fastapi import APIRouter, Depends , HTTPException
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.model.task import Task
from app.schema.task import TaskCreate

# get_all_tasks
from app.schema.task import TaskResponse
from typing import List

#  api router : used to group related routes
# depends fastapi depedncy injection system
# session ; sqlachemy session type
# sessionlocal : session factory , create db sessions
# task sqlalchemy models
# taskcreate pydantic schema
router = APIRouter(prefix="/tasks", tags=["Tasks"])
# all routes inside this file start with /tasks
# tags=["Tasks"]
def get_db():
    db = SessionLocal()
    # sessionlocal create db session
    try:
        # gives it to endpoint ..new db session crated
        yield db
    finally:
        db.close()

# before exeute the fun run task:create it will check the validation and db: session is for 
@router.post("/", status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    try:    
        # concept : swlachemy is orm it maps databse table  < --->  python class .... so in code tasks table <--> Task class
        # 1. Create python object
        new_task = Task(title=task.title)
        
        # 2. Add to session
        db.add(new_task)
        
        # 3. Commit to store permanently
        db.commit()
        
        # 4. Refresh to get the DB-generated ID
        db.refresh(new_task)
        
        # 5. Return the result
        return new_task
    
    except Exception as e:
        # Rollback in case of database errors
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Task creation failed: {str(e)}")

# get all task
# if response_model removed it convert swlachemy object to json .. return all field from the model, no validation of output ..no constrol over exposed data 
@router.get("/", response_model=List[TaskResponse])
def get_all_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).all()
    return tasks


# delete task

@router.delete("/{task_id}")
def delete_task(task_id:int,db:Session=Depends(get_db)):

    # find task
    task=db.query(Task).filter(Task.id==task_id).first()
    # if not found
    if not task:
        raise HTTPException(status_code=404,detail="Task not found")
    # delter task
    db.delete(task)
    db.commit()

    return {"message":"Task deleted successfully"}
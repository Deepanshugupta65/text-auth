from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base
# for authetication and authorzation
from sqlalchemy import ForeignKey

# this class reprents a databse table base keeps a registry of all models
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    # it is used to connect task with user who created it
    owner_id = Column(Integer,ForeignKey("users.id"))

# this code dose not create the table immediatly
# register a python class as a db table blueprint

# It becomes real only when:
# Base.metadata.create_all(bind=engine) ---

# internally -  Base.metadata.tables["tasks"] = Task

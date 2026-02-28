from sqlalchemy import Column, Integer, String, Boolean
from app.db.base import Base

# this class reprents a databse table base keeps a registry of all models
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    completed = Column(Boolean, default=False)

# this code dose not create the table immediatly
# register a python class as a db table blueprint

# It becomes real only when:
# Base.metadata.create_all(bind=engine) ---

# internally -  Base.metadata.tables["tasks"] = Task

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

from core.config import settings

connect_args = {}
pool_kwargs = {}

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
else:
    # C.3 Connection Pooling settings for PostgreSQL
    pool_kwargs = {
        "pool_size": 20,
        "max_overflow": 10,
        "pool_timeout": 30,
        "pool_recycle": 3600,
        "pool_pre_ping": True,
    }

engine = create_engine(
    settings.DATABASE_URL, connect_args=connect_args, **pool_kwargs
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

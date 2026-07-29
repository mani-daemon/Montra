from pydantic import BaseModel, ConfigDict
from typing import Generic, TypeVar, List

T = TypeVar('T')

class Page(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    
    model_config = ConfigDict(from_attributes=True)

from pydantic import BaseModel # type: ignore
from typing import Optional

class Message(BaseModel):
    id: Optional[int]
    message: str
    user_id: int
    is_bot: bool = False

class MessageCreate(BaseModel):
    message: str
    user_id: int
    is_bot: bool = False  # Optional, defaults to False

class MessageUpdate(BaseModel):
    message: str
    user_id: int

class MessageDelete(BaseModel):
    id: int

class MessageDeleteUser(BaseModel):
    user_id: int

class MessageUpdate(BaseModel):
    message: str
    id: int
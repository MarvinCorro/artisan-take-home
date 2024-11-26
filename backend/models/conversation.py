from pydantic import BaseModel
from typing import Optional, List
from models.message import Message  # Import the Message model for use in this file

class Conversation(BaseModel):
    id: Optional[int]
    user_id: int

class ConversationWithMessage(BaseModel):
    id: int
    message: Message

class ConversationMergeMessage(BaseModel):
    conversation_id: int
    message_id: int

class ConversationWithMessages(BaseModel):
    id: int
    messages: List[Message]
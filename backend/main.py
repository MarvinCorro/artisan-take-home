import sqlite3
from fastapi import FastAPI, Depends # type: ignore
from database import get_db 

app = FastAPI()

class Message:
    def __init__(self, id: int, message: str = ''):
        self.id = id
        self.message = message
    
class Conversation:
    def __init__(self, id: int, messages: list[Message] = []):
        self.id = id
        self.messages = messages

async def get_conversation(conversation_id: int):
    return Conversation(conversation_id)

@app.get("/")
def read_root():
    return {'message': 'Server running at port 8000'}

@app.post("/messages/")
def create_message(db: sqlite3.Connection = Depends(get_db)):
    return {'message': 'Message deleted'}

@app.put("/messages/{id}")
def update_message(id: int, db: sqlite3.Connection = Depends(get_db)):
    return {'message': 'Message deleted'}

@app.delete("/messages/{id}")
def delete_message(id: int, db: sqlite3.Connection = Depends(get_db)):
    return {'message': 'Message deleted'}

@app.post("/conversations/")
def create_conversation(db: sqlite3.Connection = Depends(get_db)):
    return {'message': 'Message deleted'}

@app.post("/conversations/{id}/messages/")
def append_conversation(id:int, db: sqlite3.Connection = Depends(get_db)):
    return {'message': 'Message deleted'}

@app.put("/conversations/{id}/")
def update_conversation(id:int, db: sqlite3.Connection = Depends(get_db)):
    return {'message': 'Conversation updated'}
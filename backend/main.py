import sqlite3
from fastapi import FastAPI, Depends, HTTPException # type: ignore
from backend.bot import get_responses
from backend.user import get_random_user
from database import get_db 
from pydantic import BaseModel

app = FastAPI()

class Message:
    def __init__(self, id: int, message: str = ''):
        self.id = id
        self.message = message
    
class Conversation:
    def __init__(self, id: int, messages: list[Message] = []):
        self.id = id
        self.messages = messages

class MessageBody(BaseModel):
    id: int | None
    message: str

class ConversationBody(BaseModel):
    id: int | None
    message: Message

class UserBody(BaseModel):
    id: int 
    name: str | None

class MessagePostBody(BaseModel):
    messageParams: MessageBody
    userParams: UserBody

@app.get("/")
def read_root():
    return {'message': 'Server running at port 8000'}

@app.get("/chatbot/")
def get_chatbot_options():
    return {"responses": get_responses()}

@app.get("/users/")
def get_users():
    user = get_random_user()
    return {'name': user.username, 'id': user.id}

@app.get("/users/{user_id}/conversations/")
def get_user_conversations(user_id: int, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("SELECT id FROM conversations WHERE user_id = ?", (user_id,))
        conversations = cursor.fetchall()
        return [{"conversation_id": row[0]} for row in conversations]
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    
@app.get("/users/{user_id}/messages/")
def get_user_messages(user_id: int, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("SELECT id, message FROM messages WHERE user_id = ?", (user_id,))
        messages = cursor.fetchall()
        return [{"message_id": row[0], "message": row[1]} for row in messages]
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/messages/{message_id}")
def get_message_by_id(message_id: int, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("SELECT id, message FROM messages WHERE id = ?", (message_id,))
        message = cursor.fetchone()
        if message is None:
            raise HTTPException(status_code=404, detail="Message not found")
        return {"message_id": message[0], "message": message[1]}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.post("/messages/")
def create_message(params: MessagePostBody, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("INSERT INTO messages (message, user_id) VALUES (?, ?)", (params.messageParams.message, params.userParams.id,))
        db.commit()
        return {"message_id": cursor.lastrowid, "message": params.messageParams.message, "user_id": params.userParams.id} 
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.put("/messages/")
def update_message(message: MessageBody, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("UPDATE messages SET message = ? WHERE id = ?", (message.message, message.id))
        db.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        return {"message_id": message.id, "message": message.message}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.delete("/messages/")
def delete_message(message: MessageBody, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("DELETE FROM messages WHERE id = ?", (message.id,))
        db.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        return {"message": f"Message with ID {message.id} deleted successfully"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/conversations/")
def get_all_conversations(db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("SELECT id FROM conversations")
        conversations = cursor.fetchall()
        return [{"conversation_id": row[0]} for row in conversations]
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.post("/conversations/")
def create_conversation(user: UserBody, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("INSERT INTO conversations (user_id) VALUES (?)", (user.id,))
        db.commit()
        return {"conversation_id": cursor.lastrowid, "user_id": user.id}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/conversations/{conversation_id}")
def get_conversation(conversation_id: int, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        
        # Check if the conversation exists
        cursor.execute("SELECT id FROM conversations WHERE id = ?", (conversation_id,))
        conversation = cursor.fetchone()
        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get messages associated with the conversation
        cursor.execute("""
            SELECT m.id, m.message
            FROM messages m
            JOIN conversation_messages cm ON m.id = cm.message_id
            WHERE cm.conversation_id = ?
        """, (conversation_id,))
        messages = cursor.fetchall()
        return {
            "conversation_id": conversation_id,
            "messages": [{"message_id": row[0], "message": row[1]} for row in messages]
        }
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}") 

@app.post("/conversations/{id}/messages/")
def append_conversation(params: ConversationBody, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO conversation_messages (conversation_id, message_id) VALUES (?, ?)",
            (params.id, params.message.id)
        )
        db.commit()
        return {"conversation_id": params.id, "message_id": params.message.id}
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=400, detail=f"Integrity error: {e}")
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

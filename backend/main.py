import sqlite3
from fastapi import FastAPI, Depends, HTTPException # type: ignore
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from bot import get_responses
from user import get_random_user
from database import get_db
from routes.conversations import router as conversations_router
from routes.messages import router as messages_router

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(conversations_router, prefix="/conversations", tags=["Conversations"])
app.include_router(messages_router, prefix="/messages", tags=["Messages"])

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
        cursor.execute("SELECT id, message FROM messages WHERE user_id = ? AND is_bot = FALSE", (user_id,))
        messages = cursor.fetchall()
        return [{"message_id": row[0], "message": row[1]} for row in messages]
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

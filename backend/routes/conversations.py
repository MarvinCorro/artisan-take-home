import sqlite3
from fastapi import APIRouter, Depends, HTTPException # type: ignore
from models.conversation import ConversationMergeMessage, ConversationWithMessage
from models.user import User
from database import get_db

router = APIRouter()

@router.get("/")
def get_all_conversations(db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("SELECT id FROM conversations")
        conversations = cursor.fetchall()
        return [{"conversation_id": row[0]} for row in conversations]
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.post("/")
def create_conversation(user: User, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("INSERT INTO conversations (user_id) VALUES (?)", (user.id,))
        db.commit()
        return {"conversation_id": cursor.lastrowid, "user_id": user.id}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.get("/{conversation_id}")
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

@router.post("/messages/")
def append_conversation(conversation: ConversationMergeMessage, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO conversation_messages (conversation_id, message_id) VALUES (?, ?)",
            (conversation.conversation_id, conversation.message_id)
        )
        db.commit()
        return {"conversation_id": conversation.conversation_id, "message_id": conversation.message_id}
    except sqlite3.IntegrityError as e:
        print(e)
        raise HTTPException(status_code=400, detail=f"Integrity error: {e}")
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

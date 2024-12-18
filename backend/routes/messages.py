import sqlite3
from fastapi import APIRouter, Depends, HTTPException # type: ignore
from models.message import MessageCreate, MessageDelete, MessageDeleteUser, MessageUpdate
from database import get_db

router = APIRouter()

@router.get("/{message_id}")
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

@router.post("/")
def create_message(message: MessageCreate, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute(
        "INSERT INTO messages (message, user_id, is_bot) VALUES (?, ?, ?)",
        (message.message, message.user_id, message.is_bot))
        db.commit()
        return {"message_id": cursor.lastrowid, "message": message.message, "user_id": message.user_id, "is_bot": message.is_bot} 
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.put("/")
def update_message(message: MessageUpdate, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("UPDATE messages SET message = ? WHERE id = ?", (message.message, message.id))
        db.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        return {"message_id": message.user_id, "message": message.message}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.delete("/{id}")
def delete_message(id: int, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("DELETE FROM messages WHERE id = ?", (id,))
        db.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        return {"message": f"Message with ID {id} deleted successfully"}
    except sqlite3.Error as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    
@router.get("/bots/")
def get_all_bot_messages(db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        cursor.execute("SELECT id, message FROM messages WHERE is_bot = TRUE")
        messages = cursor.fetchall()
        return [{"message_id": row[0], "message": row[1]} for row in messages]
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
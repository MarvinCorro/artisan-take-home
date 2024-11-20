import sqlite3
from typing import Generator

DB_FILE = "artisan.db"

# Dependency to provide a database connection per request
def get_db() -> Generator[sqlite3.Connection, None, None]:
    """
    Creates a new database connection for each request.
    """
    conn = sqlite3.connect(DB_FILE)  # Default is `check_same_thread=True`
    try:
        yield conn
    finally:
        conn.close()  # Ensure the connection is closed after the request

# Initialize all necessary tables
def initialize_db():
    """
    Initializes all tables in the database if they don't exist.
    """
    with sqlite3.connect(DB_FILE) as conn:
        cursor = conn.cursor()

        # Table for storing messages
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL
        )
        """)

        # Table for storing conversations
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversations (
            id INTEGER PRIMARY KEY AUTOINCREMENT
        )
        """)

        # Join table for associating messages with conversations
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS conversation_messages (
            conversation_id INTEGER NOT NULL,
            message_id INTEGER NOT NULL,
            PRIMARY KEY (conversation_id, message_id),
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
            FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
        )
        """)

        conn.commit()  # Save changes

# Run the initialization function to create tables
initialize_db()

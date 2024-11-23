-- Table for storing individual messages
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Auto-incremented message ID
    message TEXT NOT NULL                 -- The message text
    user_id INTEGER NOT NULL,             -- Reference to users.id
    is_bot BOOLEAN NOT NULL DEFAULT FALSE,-- Whether the message was sent by a bot
);

-- Table for storing conversations
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT -- Auto-incremented conversation ID
    user_id INTEGER NOT NULL
);

-- Join table for associating messages with conversations
CREATE TABLE conversation_messages (
    conversation_id INTEGER NOT NULL,    -- Reference to conversations.id
    message_id INTEGER NOT NULL,         -- Reference to messages.id
    PRIMARY KEY (conversation_id, message_id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

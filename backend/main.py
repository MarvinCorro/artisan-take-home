from fastapi import FastAPI # type: ignore

app = FastAPI()

class Message:
    def __init__(self, id: int, message: str = ''):
        self.id = id
        self.message = message
    
class Conversation:
    def __init__(self, id: int, messages: list[Message] = []):
        self.id = id
        self.messages = messages

@app.get("/")
def read_root():
    return {'message': 'Server running at port 8000'}

@app.post("/message/{id}")
def delete_message(id: int):
    return {'message': 'Message deleted'}
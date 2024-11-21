import random

class UserModel:
    def __init__(self, username: str, id: int):
        self.username = username
        self.id = id
    
users = {
  1: UserModel('jose', 1),
  2: UserModel('anna', 2),
  3: UserModel('john', 3),
  4: UserModel('jane', 4),
  5: UserModel('jim', 5),
}

def get_random_user():
    return random.choice(list(users.values()))

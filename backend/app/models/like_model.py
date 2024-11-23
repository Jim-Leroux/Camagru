from app.models.database_model import DatabaseModel

class   LikeModel:
    def __init__(self):
        self.db = DatabaseModel().db

    def get_all_likes(self):
        cursor = self.db.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM  likes")
            likes = cursor.fetchall()
        finally:
            cursor.close()
        return likes
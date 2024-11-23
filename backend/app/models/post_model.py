from app.models.database_model import DatabaseModel

class   PostModel:
    def __init__(self):
        self.db = DatabaseModel().db

    def get_all_posts(self):
        cursor = self.db.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM  posts")
            posts = cursor.fetchall()
        finally:
            cursor.close()
        return posts
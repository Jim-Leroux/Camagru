from app.models.database_model import DatabaseModel

class   CommentModel:
    def __init__(self):
        self.db = DatabaseModel().db

    def get_all_comments(self):
        cursor = self.db.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM  comments")
            comments = cursor.fetchall()
        finally:
            cursor.close()
        return comments
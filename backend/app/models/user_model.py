from app.models.database_model import DatabaseModel

class   UserModel:
	def __init__(self):
		self.db = DatabaseModel().db

	def get_all_users(self):
		cursor = self.db.cursor()
		try:
			cursor.execute("SELECT * FROM USERS")
			users = cursor.fetchall()
		finally:
			cursor.close()
		return users
	
	def get_user_by_token(self, token):
		cursor = self.db.cursor()
		try:
			cursor.execute("SELECT * FROM users WHERE is_active = %s", (token,))
			user = cursor.fetchone()
		finally:
			cursor.close()
		return user

	def get_user_by_id(self, id):
		cursor = self.db.cursor()
		try:
			cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
			user = cursor.fetchone()
		finally:
			cursor.close()
		return user

	def get_user_by_email(self, email):
		cursor = self.db.cursor()
		try:
			cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
			user = cursor.fetchone()
		finally:
			cursor.close()
		return user

	def get_user_by_username(self, username):
		cursor = self.db.cursor()
		try:
			cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
			user = cursor.fetchone()
		finally:
			cursor.close()
		return user

	def create_user(self, user):
		cursor = self.db.cursor()
		try:
			cursor.execute(
				"INSERT INTO users (username, email, password, user_token) VALUES (%s, %s, %s, %s)",
				(user["username"], user["email"], user["password"], user["user_token"])
			)
			self.db.commit()
		finally:
			cursor.close()
		return True


	def update_user(self, user):
		cursor = self.db.cursor()
		try:
			cursor.execute(
				"INSERT INTO users WHERE id = %d VALUES(%s, %s, %s)",
				(user["id"], user["username"], user["email"], user["password"])
			)
			self.db.commit()
		finally:
			cursor.closes()
		return True

	def user_login(self, user_email):
		cursor = self.db.cursor()
		try:
			cursor.execute("UPDATE users SET is_log = %s WHERE email = %s", (1, user_email))
			self.db.commit()
		finally:
			cursor.close()
		return True

	def user_logout(self, user_id):
		cursor = self.db.cursor()
		try:
			cursor.execute("UPDATE users SET is_log = %s WHERE id = %s", (0, user_id))
			self.db.commit()
		finally:
			cursor.close()
		return True
	
	def active_user(self, token):
		cursor = self.db.cursor()
		try:
			cursor.execute("UPDATE users SET is_active = 1 WHERE user_token = %s", (token,))
			self.db.commit()
		finally:
			cursor.close()
		return True

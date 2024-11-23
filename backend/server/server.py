from app.controllers.user_controller import list_users, add_user, check_session, login, logout, verify_account, resetPassword, newPassword
from app.controllers.post_controller import get_all_posts
from app.controllers.like_controller import get_all_likes
from app.controllers.comment_controller import get_all_comments

from http.server import HTTPServer, BaseHTTPRequestHandler
from router import Router

import os

router = Router()

PHOTOS_DIR = os.path.join(os.path.dirname(__file__), "../assets")

router.post("/login", login)
router.post("/logout", logout)
router.post("/register", add_user)
router.post("/resetPassword", resetPassword)
router.post("/newPassword", newPassword)

router.get("/users", list_users)
router.get("/verify", verify_account)
router.get("/checkSession", check_session)

router.get("/posts", get_all_posts)
router.get("/likes", get_all_likes)
router.get("/comments", get_all_comments)


class RequestHandler(BaseHTTPRequestHandler):
	def end_headers(self):
		self.send_header('Access-Control-Allow-Origin', 'http://localhost:9000')
		self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
		self.send_header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
		self.send_header('Access-Control-Allow-Credentials', 'true')
		super().end_headers()

	def do_OPTIONS(self):
		self.send_response(204)
		self.end_headers()

	def serve_photo(self, photo_name):
		file_path = os.path.join(PHOTOS_DIR, photo_name)
		if os.path.isfile(file_path):
			self.send_response(200)
			self.send_header("Content-Type", "image/jpeg")
			self.end_headers()
			with open(file_path, "rb") as file:
				self.wfile.write(file.read())
		else:
			self.send_response(404)
			self.end_headers()
			self.wfile.write(b"photo not found.")

	def do_GET(self):
		if self.path.startswith("/assets/"):
			photo_name = self.path[len("/assets/"):]
			self.serve_photo(photo_name)
		else:
			router.handle_request(self)

	def do_POST(self):
		router.handle_request(self)

	def do_PUT(self):
		router.handle_request(self)

	def do_DELETE(self):
		router.handle_request(self)


#security to prevent the server from restarting
if __name__ == '__main__':
		server = HTTPServer(('0.0.0.0', 8000), RequestHandler)
		print("Server running on port 8000...")
		server.serve_forever()

# PHP EQUIVALENT FOR HTTPServer
# FROM php:8.2-apache
# PHP need a web server like apache
# here is a pre-configured php-apache docker image
# https://hub.docker.com/layers/library/php/8.2-apache/images/sha256-89ad17cca246e8a6ce742b5b89ce65b34ce6223204a282e45f72b4f758ff6401

# PHP EQUIVALENT FOR BaseHTTPRequestHandler
# Super globale $_SERVER
# $_SERVER is an array containing request infos such as headers, paths etc.
# https://www.php.net/manual/en/reserved.variables.server.php

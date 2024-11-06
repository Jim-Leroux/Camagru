from app.controllers.user_controller import list_users, add_user, check_session, login, logout, verify_account
from http.server import HTTPServer, BaseHTTPRequestHandler
from router import Router

router = Router()

router.post("/login", login)
router.post("/logout", logout)
router.get("/users", list_users)
router.post("/register", add_user)
router.get("/verify", verify_account)
router.get("/checkSession", check_session)

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

	def do_GET(self):
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

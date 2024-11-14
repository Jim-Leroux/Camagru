from app.utils.utils import send_email, return_response, is_valid_email, is_valid_password, send_password_email
from app.models.user_model import UserModel
from urllib import parse

import http.cookies
import bcrypt
import secrets
import json
import time
import re

def	verify_account(request):
	parsed_path = parse.urlparse(request.path)
	query_params = parse.parse_qs(parsed_path.query)
	token = query_params.get("token", [None])[0]

	if token:
		user_model = UserModel()
		try:
			user = user_model.get_user_by_token(token)
		
		except Exception as e:
			return_response(request, 500, json.dumps({"error": "Internal server error"}))

		if user:
				user_model.active_user(token)
				user_model.update_token(user[0], 0)
				return_response(request, 200, json.dumps({"message": "user account activated"}))
		else:
			return_response(request, 401, json.dumps({"error": "Unhautorized", "token": token}))
	else:
		return_response(request, 400, json.dumps({"error": "Bad request"}))

def check_session(request):
	cookie_header = request.headers.get('Cookie')
	cookies = http.cookies.SimpleCookie(cookie_header)

	user_id = cookies.get('user_id').value if cookies.get('user_id') else None

	if user_id is None:
		return_response(request, 402, json.dumps({
			'logged': False,
			'message': 'Unauthorized: No user_id cookie'
		}))
		return

	user_model = UserModel()

	try:
		user = user_model.get_user_by_id(user_id)
	except Exception as e:
		return_response(request, 500, json.dumps({
			'logged': False,
			'message': 'Internal Server Error'
		}))
		return

	if user and user[4] == 1:
		return_response(request, 200, json.dumps({
			'logged': True,
			'message': 'User already logged'
		}))
	else:
		return_response(request, 403, json.dumps({
			'logged': False,
			'message': 'Unauthorized'
		}))


def add_user(request):
	content_length = int(request.headers['Content-Length'])
	try:
		post_data = json.loads(request.rfile.read(content_length))
	except json.JSONDecodeError as e:
		return_response(request, 400, json.dumps({"error": "register: Invalid JSON"}))
		return
	
	if not is_valid_email(post_data.get('email')):
		return_response(request, 400, json.dumps({"error": "Invalid email address"}))
		return

	if not is_valid_password(post_data.get('password')):
		return_response(request, 400, json.dumps({"error": "Password should contains at least 8 caracters, one uppercase and one special caracter"}))
		return
	
	token = secrets.token_urlsafe(16)

	user = {
		"username": post_data.get('username'),
		"email": post_data.get('email'),
		"password": post_data.get('password'),
		"user_token": token
	}

	user_model = UserModel()

	if not user["username"] or not user["email"] or not user["password"]:
		return_response(request, 400, json.dumps({"error": "Invalid credentials"}))
		return

	if user_model.get_user_by_username(user["username"]):
		return_response(request, 400, json.dumps({"error": "Username already taken"}))
		return

	if user_model.get_user_by_email(user["email"]):
		return_response(request, 400, json.dumps({"error": "Email already taken"}))
		return

	user["password"] = bcrypt.hashpw(user["password"].encode('utf-8'), bcrypt.gensalt(10))

	if user_model.create_user(user):
		send_email(user["email"], user["user_token"])
		return_response(request, 200, json.dumps({"message": "User created successfully"}))
	else:
		return_response(request, 500, json.dumps({"error": "Failed to create"}))
	return


def login(request):
	content_length = int(request.headers['Content-Length'])
	try:
		post_data = json.loads(request.rfile.read(content_length))
	except json.JSONDecodeError as e:
		return_response(request, 400, json.dumps({"error": "login: Invalid JSON"}))
		return

	user_model = UserModel()

	user = user_model.get_user_by_email(post_data.get('email'))

	if user is None:
		return_response(request, 400, json.dumps({"error": "Invalid email or password"}))
		return
	
	if user[5] == 0:
		return_response(request, 400, json.dumps({"error": "You should valid your account before"}))
		return

	if bcrypt.checkpw(post_data.get('password').encode('utf-8'), user[2].encode('utf-8')):
		user_model.user_login(post_data.get('email'))
		cookie = http.cookies.SimpleCookie()
		cookie['user_id'] = user[0]
		response_body = json.dumps({"message": "User logged successfully"})
		return_response(request, 200, response_body, cookie=cookie)
	else:
		return_response(request, 400, json.dumps({"error": "Invalid email or password"}))
	return

def logout(request):
	cookie_header = request.headers.get('Cookie')
	cookies = http.cookies.SimpleCookie(cookie_header)

	user_id = cookies.get('user_id').value if cookies.get('user_id') else None

	user_model = UserModel()

	user = user_model.get_user_by_id(user_id)

	if user and user[4] == 1:
		user_model.user_logout(user_id)

		cookie = http.cookies.SimpleCookie()
		cookie['user_id'] = ''
		cookie['user_id']['expires'] = 'Thu, 01 Jan 1970 00:00:00 GMT'
		return_response(request, 200, json.dumps({
			'logged': True,
			'message': 'User logged out'
		}), cookie=cookie)
	else:
		return_response(request, 403, json.dumps({
			'logged': False,
			'message': 'Unauthorized'
		}))

def resetPassword(request):
	content_length = int(request.headers['Content-Length'])
	try:
		post_data = json.loads(request.rfile.read(content_length))
	except json.JSONDecodeError as e:
		return_response(request, 400, json.dumps({"error": "register: Invalid JSON"}))
		return
	
	if not is_valid_email(post_data.get('email')):
		return_response(request, 400, json.dumps({"error": "Invalid email address"}))
		return

	user_model = UserModel()
	user = user_model.get_user_by_email(post_data.get("email"))

	if user is None:
		return_response(request, 400, json.dumps({"error": "Invalid email"}))
		return
	if user[5] == 0:
		return_response(request, 400, json.dumps({"error": "You should valid your account before"}))
		return
	else:
		token = secrets.token_urlsafe(16)
		user_model.update_token(user[0], token)
		send_password_email(user[3], token)
		return_response(request, 200, json.dumps({"message": "Mail successfully send"}))
		return

def newPassword(request):
	content_length = int(request.headers['Content-Length'])
	try:
		post_data = json.loads(request.rfile.read(content_length))
	except json.JSONDecodeError as e:
		return_response(request, 400, json.dumps({"error": "register: Invalid JSON"}))
		return
	
	user_model = UserModel()
	user = user_model.get_user_by_token(post_data.get('token'))

	if user is None:
		return_response(request, 401, json.dumps({"error": "Unhautorized"}))
		return
	
	if not is_valid_password(post_data.get('password')):
		return_response(request, 400, json.dumps({"error": "Password should contains at least 8 caracters, one uppercase and one special caracter"}))
		return

	else:
		password = bcrypt.hashpw(post_data.get('password').encode('utf-8'), bcrypt.gensalt(10))
		user_model.update_password(user[0], password)
		return_response(request, 200, json.dumps({"message": "Password successfully updated"}))
		return

def list_users(request):
	users = user_model.get_all_users()
	return_response(request, 200, json.dumps(users))
	return


# PHP EQUIVALENT GET ID IN URL
# if (isset($_GET['id']))

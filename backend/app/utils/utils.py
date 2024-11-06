from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

import http.cookies
import smtplib
import json
import os

load_dotenv()

def send_email(user_email):
	sender_email=os.getenv("EMAIL_USER")
	sender_password=os.getenv("EMAIL_PASSWORD")
	recipient_email=user_email
	subject="Confirmation : Camagru"
	body="Welcome from Camagru ! Please confirm your account at: "

	try:
		# Création du message
		msg = MIMEMultipart()
		msg['From'] = sender_email
		msg['To'] = recipient_email
		msg['Subject'] = subject

		# Attacher le corps du mail
		msg.attach(MIMEText(body, 'plain'))

		# Connexion au serveur SMTP (Gmail dans cet exemple)
		server = smtplib.SMTP('smtp.gmail.com', 587)
		server.starttls()  # Démarrer le chiffrement TLS
		server.login(sender_email, sender_password)  # Authentification

		# Envoi de l'email
		text = msg.as_string()
		server.sendmail(sender_email, recipient_email, text)
		server.quit()  # Fermer la connexion au serveur

		print("Email envoyé avec succès!")

	except Exception as e:
		print(f"Erreur lors de l'envoi de l'email: {e}")

def return_response(request, status_code, body, cookie=None):
	request.send_response(status_code)
	request.send_header("Content-Type", "application/json")
	if cookie:
		request.send_header("Set-Cookie", cookie.output(header='', sep=''))
	request.end_headers()
	request.wfile.write(body.encode('utf-8'))

# EQUIVALENT FOR SEND_EMAIL()
# PHP has his own function mail()
# an SMTP server is needed to use mail()
# https://www.php.net/manual/fr/function.mail.php

# EQUIVALENT FOR OS / DOTENV IN PHP
# Super globale $_ENV
# An associative array of variables passed via the environment method.
# https://www.php.net/manual/en/reserved.variables.environment.php

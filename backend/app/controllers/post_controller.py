from app.models.post_model import PostModel
from app.models.like_model import LikeModel
from app.models.comment_model import CommentModel
from app.utils.utils import utils

from PIL import Image, ImageOps
from datetime import datetime

import http.cookies
import base64
import json
import io
import os

PHOTOS_DIR = os.path.join(os.path.dirname(__file__), "../../assets")

class postCtrl:
	def createPost(request):
		content_length = int(request.headers['Content-Length'])
		try:
			post_data = json.loads(request.rfile.read(content_length))

			image_data = post_data.get("image")
			overlay_path = post_data.get("overlay")

			if not image_data or not overlay_path:
				return {"error": "Image data or overlay missing"}, 400

			# Decode the main image (base64)
			image_bytes = base64.b64decode(image_data.split(",")[1])
			image = Image.open(io.BytesIO(image_bytes)).convert("RGBA")

			# Load the overlay image
			overlay = Image.open(os.path.join(PHOTOS_DIR, overlay_path)).convert("RGBA")

			# Resize the overlay image to match the main image size
			overlay = overlay.resize(image.size, Image.Resampling.LANCZOS)

			# Composite the two images
			combined = Image.alpha_composite(image, overlay)

			# Save the resulting image
			output_dir = os.path.join(PHOTOS_DIR, "thumbnails")
			os.makedirs(output_dir, exist_ok=True)
			timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
			output_path = os.path.join(output_dir, f"thumbnail_{timestamp}.png")
			combined.save(output_path, "PNG")

			utils.return_response(request, 200, json.dumps({'url': f"/assets/thumbnails/thumbnail_{timestamp}.png"}))
			return

		except Exception as e:
			print(f"Error processing image: {e}")
			return {"error": "Internal Server Error"}, 500


	def get_all_posts(request):
		try:
			post_model = PostModel()
			like_model = LikeModel()
			comment_model = CommentModel()

			posts = post_model.get_all_posts()
			likes = like_model.get_all_likes()
			comments = comment_model.get_all_comments()

			for post in posts:
				post['created_at'] = post['created_at'].strftime('%Y-%m-%d %H:%M:%S')

			for like in likes:
				like['created_at'] = like['created_at'].strftime('%Y-%m-%d %H:%M:%S')

			for comment in comments:
				comment['created_at'] = comment['created_at'].strftime('%Y-%m-%d %H:%M:%S')

			response = ({"posts": posts})

			for post in posts:
				post.update({"likes": []})
				post.update({"comments": []})
				for like in likes:
					if (like["post_id"] == post["id"]):
						post["likes"].append(like)
				for comment in comments:
					if (comment["post_id"] == post["id"]):
						post["comments"].append(comment)

		except Exception as error:
			utils.return_response(request, 500, json.dumps({"error": str(error)}))
			return

		utils.return_response(request, 200, json.dumps(response))
		return

	def get_all_post_of_user(request):
		try:
			cookie_header = request.headers.get('Cookie')
			cookies = http.cookies.SimpleCookie(cookie_header)

			user_id = cookies.get('user_id').value if cookies.get('user_id') else None

			post_model = PostModel()

			response = post_model.get_all_post_of_user(user_id)

		except Exception as error:
			utils.return_response(request, 500, json.dumps({"error": str(error)}))
			return

		utils.return_response(request, 200, json.dumps(response))
		return

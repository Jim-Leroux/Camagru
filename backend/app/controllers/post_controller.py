from app.models.post_model import PostModel
from app.models.like_model import LikeModel
from app.models.comment_model import CommentModel
from app.utils.utils import utils

import http.cookies
import json

class postCtrl:
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

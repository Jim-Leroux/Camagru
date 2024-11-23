from app.models.post_model import PostModel
from app.utils.utils import return_response

import json

def get_all_posts(request):
    try:
        post_model = PostModel()
        posts = post_model.get_all_posts()
        for post in posts:
            post['created_at'] = post['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        response = {"posts": posts}
    except Exception as error:
        return_response(request, 500, json.dumps({"error": str(error)}))
        return

    return_response(request, 200, json.dumps(response))
    return

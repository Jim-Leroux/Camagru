from app.models.post_model import PostModel
from app.models.like_model import LikeModel
from app.utils.utils import utils

import json

def get_all_posts(request):
    try:
        post_model = PostModel()
        like_model = LikeModel()
        posts = post_model.get_all_posts()
        likes = like_model.get_all_likes()

        for post in posts:
            post['created_at'] = post['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        
        for like in likes:
            like['created_at'] = like['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        
        response = ({"posts": posts})

        for post in posts:
            post.update({"likes": []})
            for like in likes:
                if (like["post_id"] == post["id"]):
                    post["likes"].append(like)



    except Exception as error:
        utils.return_response(request, 500, json.dumps({"error": str(error)}))
        return

    utils.return_response(request, 200, json.dumps(response))
    return

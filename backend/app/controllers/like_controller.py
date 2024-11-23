from app.models.like_model import LikeModel
from app.utils.utils import return_response

import json

def get_all_likes(request):
    try:
        like_model = LikeModel()
        likes = like_model.get_all_likes()
        for like in likes:
            like['created_at'] = like['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        response = {"likes": likes}
    except Exception as error:
        return_response(request, 500, json.dumps({"error": str(error)}))
        return

    return_response(request, 200, json.dumps(response))
    return

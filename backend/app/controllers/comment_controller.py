from app.models.comment_model import CommentModel
from app.utils.utils import return_response

import json

def get_all_comments(request):
    try:
        comment_model = CommentModel()
        comments = comment_model.get_all_comments()
        for comment in comments:
            comment['created_at'] = comment['created_at'].strftime('%Y-%m-%d %H:%M:%S')
        response = {"comments": comments}
    except Exception as error:
        return_response(request, 500, json.dumps({"error": str(error)}))
        return

    return_response(request, 200, json.dumps(response))
    return

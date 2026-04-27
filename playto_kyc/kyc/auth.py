
from django.contrib.auth import get_user_model

User = get_user_model()

def get_user_from_request(request):
    user_id = request.headers.get("X-USER-ID")

    if not user_id:
        return None

    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return None
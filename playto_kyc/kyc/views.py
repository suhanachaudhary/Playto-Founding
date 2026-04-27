from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import KYCSubmission, NotificationEvent
from .serializers import KYCSerializer
from .state_machine import can_transition
from django.utils.timezone import now

from django.contrib.auth import get_user_model
User = get_user_model()

from .auth import get_user_from_request

@api_view(['POST'])
def login(request):
    username = request.data.get("username")

    try:
        user = User.objects.get(username=username)

        # 🔥 AUTO CREATE DRAFT HERE
        KYCSubmission.objects.get_or_create(
            merchant=user,
            state="draft"
        )

        return Response({
            "id": user.id,
            "username": user.username,
            "role": user.role
        })

    except:
        return Response({"error": "Invalid user"}, status=400)
        

@api_view(['POST'])
def save_draft(request):
    user = get_user_from_request(request)

    if not user:
        return Response({"error": "Unauthorized"}, status=401)

    submission, created = KYCSubmission.objects.get_or_create(
        merchant=user,
        state='draft'
    )

    submission.personal_details = request.data.get('personal_details', {})
    submission.business_details = request.data.get('business_details', {})
    submission.save()

    return Response({"message": "Draft saved"})

# @api_view(['POST'])
# def save_draft(request):
#     user = User.objects.first()

#     submission, created = KYCSubmission.objects.get_or_create(
#         merchant=user,
#         state='draft'
#     )

#     submission.personal_details = request.data.get('personal_details', {})
#     submission.business_details = request.data.get('business_details', {})
#     submission.save()

#     return Response({"message": "Draft saved"})


@api_view(['POST'])
def submit_kyc(request):
    user = get_user_from_request(request)

    if not user:
        return Response({"error": "Unauthorized"}, status=401)

    try:
        submission = KYCSubmission.objects.get(merchant=user, state='draft')
        submission.state = 'submitted'
        submission.submitted_at = now()
        submission.save()

        NotificationEvent.objects.create(
            merchant=user,
            event_type="SUBMITTED",
            payload={}
        )

        return Response({"message": "Submitted"})
    except KYCSubmission.DoesNotExist:
        return Response({"error": "No draft found"}, status=400)

# @api_view(['POST'])
# def submit_kyc(request):
#     user = User.objects.first() 

#     try:
#         submission = KYCSubmission.objects.get(merchant=user, state='draft')
#         submission.state = 'submitted'
#         submission.submitted_at = now()
#         submission.save()

#         NotificationEvent.objects.create(
#             merchant=user,
#             event_type="SUBMITTED",
#             payload={}
#         )

#         return Response({"message": "Submitted"})
#     except KYCSubmission.DoesNotExist:
#         return Response({"error": "No draft found"}, status=400)



@api_view(['GET'])
def review_queue(request):
    user = get_user_from_request(request)

    if not user:
        return Response({"error": "Unauthorized"}, status=401)

    if user.role != "reviewer":
        return Response({"error": "Forbidden"}, status=403)

    submissions = KYCSubmission.objects.all().order_by('-submitted_at')
    serializer = KYCSerializer(submissions, many=True)
    return Response(serializer.data)

# @api_view(['GET'])
# def review_queue(request):
#     submissions = KYCSubmission.objects.all().order_by('-submitted_at')

#     serializer = KYCSerializer(submissions, many=True)
#     return Response(serializer.data)

@api_view(['POST'])
def review_action(request, id):
    user = get_user_from_request(request)

    if not user or user.role != "reviewer":
        return Response({"error": "Forbidden"}, status=403)

    try:
        submission = KYCSubmission.objects.get(id=id)
    except KYCSubmission.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

    new_state = request.data.get("state")

    if not can_transition(submission.state, new_state):
        return Response({"error": "Invalid transition"}, status=400)

    submission.state = new_state
    submission.reviewed_at = now()
    submission.save()

    NotificationEvent.objects.create(
        merchant=submission.merchant,
        event_type="REVIEWED",
        payload={"new_state": new_state}
    )

    return Response({"message": "Updated"})


# @api_view(['POST'])
# def review_action(request, id):
#     try:
#         submission = KYCSubmission.objects.get(id=id)
#     except KYCSubmission.DoesNotExist:
#         return Response({"error": "Submission not found"}, status=404)

#     new_state = request.data.get("state")

#     if not can_transition(submission.state, new_state):
#         return Response(
#             {"error": f"Cannot move from {submission.state} to {new_state}"},
#             status=400
#         )

#     submission.state = new_state
#     submission.reviewed_at = now()
#     submission.save()

#     NotificationEvent.objects.create(
#         merchant=submission.merchant,
#         event_type="REVIEWED",
#         payload={"new_state": new_state}
#     )

#     return Response({"message": f"{new_state} successfully"})

@api_view(['GET'])
def all_submissions(request):
    user = get_user_from_request(request)

    if not user:
        return Response({"error": "Unauthorized"}, status=401)

    # MERCHANT sees only his data
    if user.role == "merchant":
        submissions = KYCSubmission.objects.filter(merchant=user)

    # REVIEWER sees all
    elif user.role == "reviewer":
        submissions = KYCSubmission.objects.all()

    else:
        return Response({"error": "Forbidden"}, status=403)

    serializer = KYCSerializer(submissions, many=True)
    return Response(serializer.data)


# @api_view(['GET'])
# def all_submissions(request):
#     submissions = KYCSubmission.objects.all().order_by('-id')
#     serializer = KYCSerializer(submissions, many=True)
#     return Response(serializer.data)



from .serializers import DocumentSerializer
from .models import Document

@api_view(['POST'])
def upload_document(request):
    serializer = DocumentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "File uploaded"})
    
    return Response(serializer.errors, status=400)



from datetime import timedelta
from django.utils.timezone import now

@api_view(['GET'])
def reviewer_metrics(request):
    # Queue (submitted)
    submissions = KYCSubmission.objects.filter(state="submitted")

    queue_count = submissions.count()

    # Avg time in queue
    total_time = 0
    for s in submissions:
        if s.submitted_at:
            total_time += (now() - s.submitted_at).total_seconds()

    avg_time = total_time / queue_count if queue_count > 0 else 0

    # At-risk (>24 hours)
    at_risk_count = submissions.filter(
        submitted_at__lt=now() - timedelta(hours=24)
    ).count()

    # Approval rate (last 7 days)
    last_7_days = now() - timedelta(days=7)

    approved = KYCSubmission.objects.filter(
        state="approved",
        reviewed_at__gte=last_7_days
    ).count()

    total_reviewed = KYCSubmission.objects.filter(
        reviewed_at__gte=last_7_days
    ).count()

    approval_rate = (approved / total_reviewed) if total_reviewed > 0 else 0

    return Response({
        "queue_count": queue_count,
        "avg_time_in_queue_seconds": avg_time,
        "at_risk_count": at_risk_count,
        "approval_rate_last_7_days": approval_rate
    })    
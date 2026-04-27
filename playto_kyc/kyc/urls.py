
from django.urls import path
from .views import (
    save_draft,
    submit_kyc,
    review_queue,
    review_action,
    upload_document,
    reviewer_metrics,
    all_submissions,
    login
)

urlpatterns = [
    path('login/', login),
    path('save-draft/', save_draft),
    path('submit/', submit_kyc),
    path('review-queue/', review_queue),
    path('review/<int:id>/', review_action),
    path('upload-doc/', upload_document),
    path('metrics/', reviewer_metrics),
    path('all-submissions/', all_submissions),
]

# from django.urls import path
# from .views import save_draft, submit_kyc, review_queue, review_action
# from .views import upload_document
# from .views import reviewer_metrics

# urlpatterns = [
#     path('save-draft/', save_draft),
#     path('submit/', submit_kyc),
#     path('review-queue/', review_queue),
#     path('review/<int:id>/', review_action),
#     path('upload-doc/', upload_document),
#     path('metrics/', reviewer_metrics),
# ]
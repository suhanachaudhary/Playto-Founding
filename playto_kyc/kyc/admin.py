
from django.contrib import admin
from .models import User, KYCSubmission, Document, NotificationEvent

admin.site.register(User)
admin.site.register(KYCSubmission)
admin.site.register(Document)
admin.site.register(NotificationEvent)


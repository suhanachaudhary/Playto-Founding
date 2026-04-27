
from rest_framework import serializers
from .models import KYCSubmission, Document

class KYCSerializer(serializers.ModelSerializer):
    merchant_id = serializers.IntegerField(source="merchant.id", read_only=True)
    merchant_username = serializers.CharField(source="merchant.username", read_only=True)
    merchant_email = serializers.CharField(source="merchant.email", read_only=True)


    class Meta:
        model = KYCSubmission
        fields = '__all__'
        read_only_fields = ['state', 'merchant']


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'

    def validate_file(self, file):
        # Size check (5MB)
        if file.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("File size must be under 5MB")

        # Type check
        allowed_types = ['application/pdf', 'image/jpeg', 'image/png']
        if file.content_type not in allowed_types:
            raise serializers.ValidationError("Only PDF, JPG, PNG allowed")

        return file        
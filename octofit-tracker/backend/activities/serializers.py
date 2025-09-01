from rest_framework import serializers
from .models import ActivityType, Activity, Achievement


class ActivityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityType
        fields = ['id', 'name', 'description', 'points_per_minute', 'icon']


class ActivitySerializer(serializers.ModelSerializer):
    activity_type = ActivityTypeSerializer(read_only=True)
    activity_type_id = serializers.IntegerField(write_only=True)
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Activity
        fields = ['id', 'activity_type', 'activity_type_id', 'user', 
                 'duration_minutes', 'distance', 'calories_burned', 'notes',
                 'date_logged', 'activity_date', 'points_earned']
        read_only_fields = ['id', 'date_logged', 'points_earned', 'user']
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ActivityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['activity_type', 'duration_minutes', 'distance', 
                 'calories_burned', 'notes', 'activity_date']


class AchievementSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Achievement
        fields = ['id', 'user', 'name', 'description', 'badge_icon', 
                 'points_required', 'earned_date']
        read_only_fields = ['id', 'earned_date', 'user']
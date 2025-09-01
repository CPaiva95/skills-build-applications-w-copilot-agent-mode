from rest_framework import serializers
from .models import Team, TeamMembership, Challenge
from django.contrib.auth import get_user_model

User = get_user_model()


class TeamMembershipSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = TeamMembership
        fields = ['user', 'joined_date', 'role', 'is_active']


class TeamSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    members = serializers.StringRelatedField(many=True, read_only=True)
    total_points = serializers.ReadOnlyField()
    member_count = serializers.ReadOnlyField()
    memberships = TeamMembershipSerializer(source='teammembership_set', many=True, read_only=True)
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'created_by', 'members', 
                 'created_at', 'is_active', 'max_members', 'total_points', 
                 'member_count', 'memberships']
        read_only_fields = ['id', 'created_at', 'created_by']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TeamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['name', 'description', 'max_members']


class ChallengeSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)
    participating_teams = TeamSerializer(many=True, read_only=True)
    
    class Meta:
        model = Challenge
        fields = ['id', 'name', 'description', 'start_date', 'end_date',
                 'challenge_type', 'target_value', 'participating_teams',
                 'created_by', 'is_active']
        read_only_fields = ['id', 'created_by']
        
    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class ChallengeCreateSerializer(serializers.ModelSerializer):
    participating_team_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True
    )
    
    class Meta:
        model = Challenge
        fields = ['name', 'description', 'start_date', 'end_date',
                 'challenge_type', 'target_value', 'participating_team_ids']
        
    def create(self, validated_data):
        team_ids = validated_data.pop('participating_team_ids')
        validated_data['created_by'] = self.context['request'].user
        challenge = super().create(validated_data)
        
        teams = Team.objects.filter(id__in=team_ids)
        challenge.participating_teams.set(teams)
        return challenge
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Sum
from .models import ActivityType, Activity, Achievement
from .serializers import ActivityTypeSerializer, ActivitySerializer, AchievementSerializer, ActivityCreateSerializer


class ActivityTypeListView(generics.ListAPIView):
    """List all activity types"""
    queryset = ActivityType.objects.all()
    serializer_class = ActivityTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class ActivityListCreateView(generics.ListCreateAPIView):
    """List user's activities and create new activities"""
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ActivityCreateSerializer
        return ActivitySerializer


class ActivityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete specific activity"""
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user)


class AchievementListView(generics.ListAPIView):
    """List user's achievements"""
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Achievement.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats_view(request):
    """Get user's fitness statistics"""
    user = request.user
    activities = Activity.objects.filter(user=user)
    
    stats = {
        'total_activities': activities.count(),
        'total_points': user.profile.points if hasattr(user, 'profile') else 0,
        'total_duration': activities.aggregate(Sum('duration_minutes'))['duration_minutes__sum'] or 0,
        'total_distance': activities.aggregate(Sum('distance'))['distance__sum'] or 0,
        'total_calories': activities.aggregate(Sum('calories_burned'))['calories_burned__sum'] or 0,
        'achievements_count': Achievement.objects.filter(user=user).count(),
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def leaderboard_view(request):
    """Get fitness leaderboard"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # Get users with their points, ordered by points descending
    users = User.objects.select_related('profile').order_by('-profile__points')[:10]
    
    leaderboard = []
    for i, user in enumerate(users, 1):
        leaderboard.append({
            'rank': i,
            'username': user.username,
            'points': user.profile.points if hasattr(user, 'profile') else 0,
            'activities_count': Activity.objects.filter(user=user).count(),
        })
    
    return Response(leaderboard)

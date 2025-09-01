from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Team, TeamMembership, Challenge
from .serializers import TeamSerializer, TeamCreateSerializer, ChallengeSerializer, ChallengeCreateSerializer


class TeamListCreateView(generics.ListCreateAPIView):
    """List all teams and create new teams"""
    queryset = Team.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TeamCreateSerializer
        return TeamSerializer


class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete specific team"""
    queryset = Team.objects.filter(is_active=True)
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserTeamsView(generics.ListAPIView):
    """List teams that the current user belongs to"""
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Team.objects.filter(members=self.request.user, is_active=True)


class ChallengeListCreateView(generics.ListCreateAPIView):
    """List all challenges and create new challenges"""
    queryset = Challenge.objects.filter(is_active=True)
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ChallengeCreateSerializer
        return ChallengeSerializer


class ChallengeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, or delete specific challenge"""
    queryset = Challenge.objects.filter(is_active=True)
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def join_team_view(request, team_id):
    """Join a team"""
    try:
        team = Team.objects.get(id=team_id, is_active=True)
        
        # Check if user is already a member
        if TeamMembership.objects.filter(user=request.user, team=team).exists():
            return Response(
                {'error': 'You are already a member of this team'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if team is full
        if team.member_count >= team.max_members:
            return Response(
                {'error': 'Team is full'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Add user to team
        TeamMembership.objects.create(user=request.user, team=team)
        
        return Response({'message': f'Successfully joined {team.name}'})
        
    except Team.DoesNotExist:
        return Response(
            {'error': 'Team not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def leave_team_view(request, team_id):
    """Leave a team"""
    try:
        team = Team.objects.get(id=team_id, is_active=True)
        membership = TeamMembership.objects.get(user=request.user, team=team)
        
        # Check if user is the creator and there are other members
        if team.created_by == request.user and team.member_count > 1:
            return Response(
                {'error': 'You cannot leave a team you created while other members exist'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        membership.delete()
        
        # If this was the last member and creator, deactivate the team
        if team.member_count == 0:
            team.is_active = False
            team.save()
        
        return Response({'message': f'Successfully left {team.name}'})
        
    except (Team.DoesNotExist, TeamMembership.DoesNotExist):
        return Response(
            {'error': 'Team membership not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def team_leaderboard_view(request):
    """Get team leaderboard"""
    teams = Team.objects.filter(is_active=True).order_by('-created_at')
    
    # Calculate team rankings by total points
    team_data = []
    for team in teams:
        team_data.append({
            'team': team,
            'total_points': team.total_points
        })
    
    # Sort by total points
    team_data.sort(key=lambda x: x['total_points'], reverse=True)
    
    leaderboard = []
    for i, data in enumerate(team_data[:10], 1):
        team = data['team']
        leaderboard.append({
            'rank': i,
            'team_name': team.name,
            'total_points': data['total_points'],
            'member_count': team.member_count,
        })
    
    return Response(leaderboard)

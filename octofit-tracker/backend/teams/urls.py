from django.urls import path
from . import views

urlpatterns = [
    path('', views.TeamListCreateView.as_view(), name='team-list-create'),
    path('<int:pk>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('my-teams/', views.UserTeamsView.as_view(), name='user-teams'),
    path('<int:team_id>/join/', views.join_team_view, name='join-team'),
    path('<int:team_id>/leave/', views.leave_team_view, name='leave-team'),
    path('leaderboard/', views.team_leaderboard_view, name='team-leaderboard'),
    path('challenges/', views.ChallengeListCreateView.as_view(), name='challenge-list-create'),
    path('challenges/<int:pk>/', views.ChallengeDetailView.as_view(), name='challenge-detail'),
]
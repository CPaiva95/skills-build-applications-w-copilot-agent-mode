from django.urls import path
from . import views

urlpatterns = [
    path('types/', views.ActivityTypeListView.as_view(), name='activity-types'),
    path('', views.ActivityListCreateView.as_view(), name='activity-list-create'),
    path('<int:pk>/', views.ActivityDetailView.as_view(), name='activity-detail'),
    path('achievements/', views.AchievementListView.as_view(), name='achievement-list'),
    path('stats/', views.user_stats_view, name='user-stats'),
    path('leaderboard/', views.leaderboard_view, name='leaderboard'),
]
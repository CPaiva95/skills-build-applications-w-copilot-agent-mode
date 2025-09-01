from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.UserCreateView.as_view(), name='user-register'),
    path('login/', views.login_view, name='user-login'),
    path('logout/', views.logout_view, name='user-logout'),
    path('profile/', views.UserDetailView.as_view(), name='user-profile'),
    path('profile/update/', views.UserProfileView.as_view(), name='user-profile-update'),
    path('users/', views.UserListView.as_view(), name='user-list'),
]
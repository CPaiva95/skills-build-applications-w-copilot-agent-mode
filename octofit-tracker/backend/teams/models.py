from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Team(models.Model):
    """Teams for group competitions"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_teams')
    members = models.ManyToManyField(User, through='TeamMembership', related_name='teams')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    max_members = models.PositiveIntegerField(default=20)
    
    def __str__(self):
        return self.name
    
    @property
    def total_points(self):
        """Calculate total points for all team members"""
        return sum(member.profile.points for member in self.members.all())
    
    @property
    def member_count(self):
        return self.members.count()


class TeamMembership(models.Model):
    """Membership details for team members"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    joined_date = models.DateTimeField(auto_now_add=True)
    role = models.CharField(
        max_length=20,
        choices=[
            ('member', 'Member'),
            ('captain', 'Captain'),
            ('admin', 'Admin'),
        ],
        default='member'
    )
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['user', 'team']
    
    def __str__(self):
        return f"{self.user.username} in {self.team.name}"


class Challenge(models.Model):
    """Team challenges and competitions"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    challenge_type = models.CharField(
        max_length=20,
        choices=[
            ('points', 'Total Points'),
            ('duration', 'Total Duration'),
            ('activities', 'Number of Activities'),
            ('distance', 'Total Distance'),
        ],
        default='points'
    )
    target_value = models.PositiveIntegerField(help_text="Target value for the challenge")
    participating_teams = models.ManyToManyField(Team, related_name='challenges')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name

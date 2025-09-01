from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class ActivityType(models.Model):
    """Types of fitness activities"""
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    points_per_minute = models.DecimalField(max_digits=5, decimal_places=2, default=1.0)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name for UI")
    
    def __str__(self):
        return self.name


class Activity(models.Model):
    """Individual activity logs"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.ForeignKey(ActivityType, on_delete=models.CASCADE)
    duration_minutes = models.PositiveIntegerField()
    distance = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, help_text="Distance in km")
    calories_burned = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    date_logged = models.DateTimeField(auto_now_add=True)
    activity_date = models.DateField()
    points_earned = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-activity_date', '-date_logged']
        verbose_name_plural = "Activities"
    
    def save(self, *args, **kwargs):
        # Calculate points automatically
        if not self.points_earned:
            self.points_earned = int(self.duration_minutes * self.activity_type.points_per_minute)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.user.username} - {self.activity_type.name} ({self.duration_minutes} min)"


class Achievement(models.Model):
    """User achievements and badges"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    name = models.CharField(max_length=100)
    description = models.TextField()
    badge_icon = models.CharField(max_length=50, blank=True)
    points_required = models.PositiveIntegerField()
    earned_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'name']
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"

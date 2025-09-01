import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const statsResponse = await fetch('/api/activities/stats/', {
        credentials: 'include',
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent activities
      const activitiesResponse = await fetch('/api/activities/', {
        credentials: 'include',
      });
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setRecentActivities(activitiesData.slice(0, 5)); // Show last 5 activities
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">
            Welcome back, {user.first_name || user.username}! 🌟
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Total Points</h6>
                  <h3 className="mb-0">{user.profile?.points || 0}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-trophy fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Activities</h6>
                  <h3 className="mb-0">{stats.total_activities || 0}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-running fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Minutes</h6>
                  <h3 className="mb-0">{stats.total_duration || 0}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-clock fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h6 className="card-title">Distance (km)</h6>
                  <h3 className="mb-0">{stats.total_distance || 0}</h3>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-road fa-2x opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Activities */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Activities</h5>
              <Link to="/activities" className="btn btn-primary btn-sm">
                View All
              </Link>
            </div>
            <div className="card-body">
              {recentActivities.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th>Duration</th>
                        <th>Points</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((activity) => (
                        <tr key={activity.id}>
                          <td>
                            <strong>{activity.activity_type.name}</strong>
                            {activity.distance && (
                              <small className="text-muted d-block">
                                {activity.distance} km
                              </small>
                            )}
                          </td>
                          <td>{activity.duration_minutes} min</td>
                          <td>
                            <span className="badge bg-primary">
                              {activity.points_earned}
                            </span>
                          </td>
                          <td>
                            {new Date(activity.activity_date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-dumbbell fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">No activities yet</h6>
                  <p className="text-muted">Start your fitness journey today!</p>
                  <Link to="/activities" className="btn btn-primary">
                    Log Your First Activity
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <Link to="/activities" className="btn btn-outline-primary">
                  <i className="fas fa-plus me-2"></i>
                  Log Activity
                </Link>
                <Link to="/teams" className="btn btn-outline-success">
                  <i className="fas fa-users me-2"></i>
                  Join Team
                </Link>
                <Link to="/leaderboard" className="btn btn-outline-info">
                  <i className="fas fa-medal me-2"></i>
                  View Rankings
                </Link>
                <Link to="/profile" className="btn btn-outline-secondary">
                  <i className="fas fa-user me-2"></i>
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Fitness Goal Card */}
          {user.fitness_goal && (
            <div className="card mt-3">
              <div className="card-header">
                <h6 className="mb-0">Your Goal</h6>
              </div>
              <div className="card-body">
                <p className="card-text">"{user.fitness_goal}"</p>
                <small className="text-muted">Keep pushing towards your goal!</small>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
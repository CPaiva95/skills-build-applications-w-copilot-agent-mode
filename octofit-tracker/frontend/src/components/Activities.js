import React, { useState, useEffect } from 'react';

const Activities = ({ user }) => {
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch activities
      const activitiesResponse = await fetch('/api/activities/', {
        credentials: 'include',
      });
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);
      }

      // Fetch activity types
      const typesResponse = await fetch('/api/activities/types/', {
        credentials: 'include',
      });
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        setActivityTypes(typesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Activities</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <i className="fas fa-plus me-2"></i>
          Log Activity
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Log New Activity</h5>
          </div>
          <div className="card-body">
            <p className="text-muted">Activity logging form will be implemented here.</p>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Activity History</h5>
            </div>
            <div className="card-body">
              {activities.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Activity</th>
                        <th>Duration</th>
                        <th>Distance</th>
                        <th>Points</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activities.map((activity) => (
                        <tr key={activity.id}>
                          <td>{activity.activity_type?.name || 'Unknown'}</td>
                          <td>{activity.duration_minutes} min</td>
                          <td>{activity.distance ? `${activity.distance} km` : '-'}</td>
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
                  <h6 className="text-muted">No activities logged yet</h6>
                  <p className="text-muted">Start tracking your fitness journey!</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                  >
                    Log Your First Activity
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Available Activities</h6>
            </div>
            <div className="card-body">
              {activityTypes.map((type) => (
                <div key={type.id} className="d-flex justify-content-between align-items-center mb-2">
                  <span>
                    <i className={`fas fa-${type.icon || 'dumbbell'} me-2`}></i>
                    {type.name}
                  </span>
                  <small className="text-muted">
                    {type.points_per_minute} pts/min
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
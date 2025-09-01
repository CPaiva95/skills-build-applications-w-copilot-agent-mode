import React, { useState, useEffect } from 'react';

const Profile = ({ user, setUser }) => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile/update/', {
        credentials: 'include',
      });
      if (response.ok) {
        const profileData = await response.json();
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
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
        <div className="col-md-8 mx-auto">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Profile</h5>
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={() => setEditing(!editing)}
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-user fa-2x text-white"></i>
                </div>
                <h4 className="mt-3">{user.first_name} {user.last_name}</h4>
                <p className="text-muted">@{user.username}</p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <h6>Basic Information</h6>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={user.email} 
                      readOnly={!editing}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Fitness Goal</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={user.fitness_goal || ''} 
                      readOnly={!editing}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <h6>Fitness Profile</h6>
                  <div className="mb-3">
                    <label className="form-label">Fitness Level</label>
                    <select 
                      className="form-select" 
                      value={profile.fitness_level || 'beginner'}
                      disabled={!editing}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      value={profile.bio || ''}
                      readOnly={!editing}
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="text-center">
                  <button className="btn btn-primary me-2">
                    Save Changes
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">Your Statistics</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="border-end">
                    <h3 className="text-primary">{profile.points || 0}</h3>
                    <small className="text-muted">Total Points</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border-end">
                    <h3 className="text-success">0</h3>
                    <small className="text-muted">Activities</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border-end">
                    <h3 className="text-info">0</h3>
                    <small className="text-muted">Teams</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <h3 className="text-warning">0</h3>
                  <small className="text-muted">Achievements</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
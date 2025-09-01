import React, { useState, useEffect } from 'react';

const Teams = ({ user }) => {
  const [teams, setTeams] = useState([]);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamsData();
  }, []);

  const fetchTeamsData = async () => {
    try {
      // Fetch all teams
      const teamsResponse = await fetch('/api/teams/', {
        credentials: 'include',
      });
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);
      }

      // Fetch user's teams
      const userTeamsResponse = await fetch('/api/teams/my-teams/', {
        credentials: 'include',
      });
      if (userTeamsResponse.ok) {
        const userTeamsData = await userTeamsResponse.json();
        setUserTeams(userTeamsData);
      }
    } catch (error) {
      console.error('Error fetching teams data:', error);
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
      <h1 className="mb-4">Teams</h1>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Teams</h5>
              <button className="btn btn-primary btn-sm">
                Create Team
              </button>
            </div>
            <div className="card-body">
              {userTeams.length > 0 ? (
                userTeams.map((team) => (
                  <div key={team.id} className="card mb-3">
                    <div className="card-body">
                      <h6 className="card-title">{team.name}</h6>
                      <p className="card-text text-muted">{team.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {team.member_count} members
                        </small>
                        <span className="badge bg-primary">
                          {team.total_points} points
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">No teams yet</h6>
                  <p className="text-muted">Join or create a team to compete!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Available Teams</h5>
            </div>
            <div className="card-body">
              {teams.filter(team => !userTeams.find(ut => ut.id === team.id)).length > 0 ? (
                teams
                  .filter(team => !userTeams.find(ut => ut.id === team.id))
                  .map((team) => (
                    <div key={team.id} className="card mb-3">
                      <div className="card-body">
                        <h6 className="card-title">{team.name}</h6>
                        <p className="card-text text-muted">{team.description}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {team.member_count}/{team.max_members} members
                          </small>
                          <button className="btn btn-outline-primary btn-sm">
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-search fa-3x text-muted mb-3"></i>
                  <h6 className="text-muted">No available teams</h6>
                  <p className="text-muted">All teams are full or you're already a member!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;
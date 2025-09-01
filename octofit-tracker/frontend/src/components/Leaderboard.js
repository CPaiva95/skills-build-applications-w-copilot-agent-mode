import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [userLeaderboard, setUserLeaderboard] = useState([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Fetch user leaderboard
      const userResponse = await fetch('/api/activities/leaderboard/', {
        credentials: 'include',
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserLeaderboard(userData);
      }

      // Fetch team leaderboard
      const teamResponse = await fetch('/api/teams/leaderboard/', {
        credentials: 'include',
      });
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeamLeaderboard(teamData);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <i className="fas fa-trophy text-warning"></i>;
      case 2:
        return <i className="fas fa-medal text-secondary"></i>;
      case 3:
        return <i className="fas fa-medal text-warning"></i>;
      default:
        return <span className="badge bg-light text-dark">{rank}</span>;
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
      <h1 className="mb-4">🏆 Leaderboard</h1>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Individual Rankings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            Team Rankings
          </button>
        </li>
      </ul>

      {/* User Leaderboard */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Top Individual Performers</h5>
          </div>
          <div className="card-body">
            {userLeaderboard.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Username</th>
                      <th>Points</th>
                      <th>Activities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userLeaderboard.map((user) => (
                      <tr key={user.username}>
                        <td className="text-center">
                          {getRankIcon(user.rank)}
                        </td>
                        <td>
                          <strong>{user.username}</strong>
                        </td>
                        <td>
                          <span className="badge bg-primary fs-6">
                            {user.points}
                          </span>
                        </td>
                        <td>{user.activities_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                <h6 className="text-muted">No rankings yet</h6>
                <p className="text-muted">Start logging activities to appear on the leaderboard!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Leaderboard */}
      {activeTab === 'teams' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Top Teams</h5>
          </div>
          <div className="card-body">
            {teamLeaderboard.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team Name</th>
                      <th>Total Points</th>
                      <th>Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamLeaderboard.map((team) => (
                      <tr key={team.team_name}>
                        <td className="text-center">
                          {getRankIcon(team.rank)}
                        </td>
                        <td>
                          <strong>{team.team_name}</strong>
                        </td>
                        <td>
                          <span className="badge bg-success fs-6">
                            {team.total_points}
                          </span>
                        </td>
                        <td>{team.member_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="fas fa-users fa-3x text-muted mb-3"></i>
                <h6 className="text-muted">No team rankings yet</h6>
                <p className="text-muted">Create or join teams to compete!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
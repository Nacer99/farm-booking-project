import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FarmManagerDashboard.css';

function FarmManagerDashboard() {
  const [farms, setFarms] = useState([]);

  const fetchManagerFarms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/farms/manager`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch manager farms');
      }
      const data = await response.json();
      setFarms(data);
    } catch (error) {
      console.error('Error fetching manager farms:', error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchManagerFarms();
  }, []);

  return (
    <div className="farm-manager-dashboard">
      <h2>Farm Manager Dashboard</h2>
      <div className="button-container">
        <Link to="/add-farm" className="dashboard-button">Add a New Farm</Link>
        <Link to="/edit-farm" className="dashboard-button">Edit a Farm</Link>
      </div>
      <div className="farms-list">
        <h3>Your Farms:</h3>
        {farms.map(farm => (
          <div key={farm.id} className="farm-item">
            <h4>{farm.name}</h4>
            <Link to={`/edit-farm/${farm.id}`}>Edit</Link>
          </div>
        ))}
      </div>
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
}

export default FarmManagerDashboard;
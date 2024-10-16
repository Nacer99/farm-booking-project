// eslint-disable-next-line no-unused-vars
import { API_URL } from '../config';
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FarmManagerDashboard.css';

import { API_URL } from '../config';
import { useState, useEffect } from 'react';

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

  // Rest of your component code...
}

const FarmManagerDashboard = () => {
  return (
    <div className="farm-manager-dashboard">
      <h2>Farm Manager Dashboard</h2>
      <div className="button-container">
        <Link to="/add-farm" className="dashboard-button">Add a New Farm</Link>
        <Link to="/edit-farm" className="dashboard-button">Edit a Farm</Link>
      </div>
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  );
};

export default FarmManagerDashboard;
// eslint-disable-next-line no-unused-vars
import { API_URL } from '../config';
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/FarmManagerDashboard.css';

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
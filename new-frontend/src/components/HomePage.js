import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const [farms, setFarms] = useState([]);

  const fetchFarms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/farms`);
      if (!response.ok) {
        throw new Error('Failed to fetch farms');
      }
      const data = await response.json();
      setFarms(data);
    } catch (error) {
      console.error('Error fetching farms:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  return (
    <div className="home-page">
      <h1>Welcome to Farm Booking</h1>
      <div className="button-container">
        <Link to="/book" className="home-button">I want to book a farm</Link>
        <Link to="/manager" className="home-button">I want to list a farm</Link>
      </div>
      <div className="farms-list">
        <h2>Available Farms</h2>
        {farms.map(farm => (
          <div key={farm.id} className="farm-item">
            <h3>{farm.name}</h3>
            <p>{farm.description}</p>
            <Link to={`/farm/${farm.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
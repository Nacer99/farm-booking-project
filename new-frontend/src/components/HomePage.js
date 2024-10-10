import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to Farm Booking</h1>
      <div className="button-container">
        <Link to="/book" className="home-button">I want to book a farm</Link>
        <Link to="/manager" className="home-button">I want to list a farm</Link>
      </div>
    </div>
  );
};

export default HomePage;
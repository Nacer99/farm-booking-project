import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BookingConfirmation.css';

const BookingConfirmation = () => {
  return (
    <div className="booking-confirmation">
      <h2>Booking Confirmed!</h2>
      <p>Thank you for your booking. We're excited to host you at the farm!</p>
      <p>You will receive a confirmation email shortly with all the details of your booking.</p>
      <div className="confirmation-actions">
        <Link to="/" className="home-button">Return to Home</Link>
        <Link to="/book" className="book-again-button">Book Another Farm</Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
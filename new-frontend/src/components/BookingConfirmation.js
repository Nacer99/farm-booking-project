import { API_URL } from '../config';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/BookingConfirmation.css';

const BookingConfirmation = () => {
  const [email, setEmail] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalMeals, bookedMeals, farmName, bookingDate, bookingId } = location.state || {};

  const confirmBooking = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Remove Authorization header since no user is logged in
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bookingId: bookingId,
          clientEmail: email,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to confirm booking');
      }
      await response.json();
      setConfirmed(true);
    } catch (error) {
      console.error('Error confirming booking:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await confirmBooking();
      const response = await fetch(`${API_URL}/api/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Remove Authorization header since no user is logged in
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ email, totalMeals, bookedMeals, farmName, bookingDate }),
      });

      if (response.ok) {
        alert('Confirmation email sent successfully!');
        navigate('/');  // Redirect to home page after sending email
      } else {
        alert('Failed to send confirmation email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      alert('An error occurred while sending the confirmation email. Please try again.');
    }
  };

  return (
    <div className="booking-confirmation">
      <h2>Booking Confirmation</h2>
      <p>
        Nous vous confirmons la réservation de {totalMeals} "{bookedMeals}" 
        chez "{farmName}" le {new Date(bookingDate).toLocaleDateString()}.
      </p>
      <p>Pour recevoir votre confirmation par email, merci de renseigner votre adresse email ci-dessous.</p>
      <form onSubmit={handleEmailSubmit} className="email-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          required
        />
        <button type="submit">Envoyer</button>
      </form>
      {confirmed && <p>Votre réservation a été confirmée. Merci !</p>}
    </div>
  );
};

export default BookingConfirmation;
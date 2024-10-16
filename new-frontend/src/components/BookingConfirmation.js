// eslint-disable-next-line no-unused-vars
import { API_URL } from '../config';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/BookingConfirmation.css';

const confirmBooking = async () => {
  try {
    const response = await fetch(`${API_URL}/api/bookings/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId: booking.id,
        clientEmail: email,
      }),
    });
    if (!response.ok) {
      throw new Error('Failed to confirm booking');
    }
    const data = await response.json();
    setConfirmed(true);
  } catch (error) {
    console.error('Error confirming booking:', error);
    // Handle error
  }
};

const BookingConfirmation = () => {
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { totalMeals, bookedMeals, farmName, bookingDate } = location.state || {};

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement API call to send confirmation email
      const response = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    </div>
  );
};

export default BookingConfirmation;
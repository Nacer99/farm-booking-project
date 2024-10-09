import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FarmCard from './FarmCard';

const ClientDashboard = () => {
    const [farms, setFarms] = useState([]);
    const [date, setDate] = useState('');

    const fetchFarms = async () => {
        const response = await fetch(`/api/farms?date=${date}`);
        const data = await response.json();
        setFarms(data);
    };

    const handleBooking = async (farmId, email) => {
        const response = await fetch(`/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ farmId, email }),
        });
        if (response.ok) {
            alert('Booking confirmed! A confirmation email has been sent.');
        }
    };

    return (
        <div>
            <h2>Book a Farm</h2>
            <Link to="/" className="back-button">Back to Home</Link>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={fetchFarms}>Search Farms</button>
            <div className="farm-list">
                {farms.map((farm) => (
                    <FarmCard key={farm.id} farm={farm} onBook={handleBooking} />
                ))}
            </div>
        </div>
    );
};

export default ClientDashboard;
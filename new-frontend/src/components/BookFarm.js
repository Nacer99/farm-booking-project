import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/BookFarm.css';

function BookFarm() {
  const [date, setDate] = useState(new Date());
  const [availableFarms, setAvailableFarms] = useState([]);

  const fetchAvailableFarms = async (selectedDate) => {
    try {
      const response = await fetch(`${API_URL}/api/farms/available?date=${selectedDate.toISOString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch available farms');
      }
      const data = await response.json();
      setAvailableFarms(data);
    } catch (error) {
      console.error('Error fetching available farms:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    fetchAvailableFarms(date);
  }, [date]);

  const onDateChange = (newDate) => {
    setDate(newDate);
    fetchAvailableFarms(newDate);
  };

  return (
    <div className="book-farm">
      <h2>Book a Farm</h2>
      <Calendar onChange={onDateChange} value={date} />
      <div className="available-farms">
        {availableFarms.map(farm => (
          <div key={farm.id} className="farm-card">
            <Link to={`/farm/${farm.id}?date=${date.toISOString()}`}>
              <h3>{farm.name}</h3>
              <img src={farm.photo} alt={farm.name} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookFarm;
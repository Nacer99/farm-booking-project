// eslint-disable-next-line no-unused-vars
import { API_URL } from '../config';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/BookFarm.css';

function BookFarm() {
  const [farms, setFarms] = useState([]);

  const fetchAvailableFarms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/farms/available`);
      if (!response.ok) {
        throw new Error('Failed to fetch available farms');
      }
      const data = await response.json();
      setFarms(data);
    } catch (error) {
      console.error('Error fetching available farms:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    fetchAvailableFarms();
  }, []);

  // Rest of your component code...
}

const BookFarm = () => {
  const [date, setDate] = useState(new Date());
  const [availableFarms, setAvailableFarms] = useState([]);

  const onDateChange = (newDate) => {
    setDate(newDate);
    // TODO: Fetch available farms for this date from your API
    setAvailableFarms([
      { id: 1, name: "Green Acres Farm", photo: "https://example.com/farm1.jpg" },
      { id: 2, name: "Sunset Valley Ranch", photo: "https://example.com/farm2.jpg" },
      // Add more dummy farms as needed
    ]);
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
};

export default BookFarm;
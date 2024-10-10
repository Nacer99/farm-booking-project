import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/BookFarm.css';

const BookFarm = () => {
  const [date, setDate] = useState(new Date());
  const [availableFarms, setAvailableFarms] = useState([]);

  const onDateChange = (newDate) => {
    setDate(newDate);
    // TODO: Fetch available farms for this date from your API
    // setAvailableFarms(fetchedFarms);
  };

  return (
    <div className="book-farm">
      <h2>Book a Farm</h2>
      <Calendar onChange={onDateChange} value={date} />
      <div className="available-farms">
        {availableFarms.map(farm => (
          <div key={farm.id} className="farm-card">
            <h3>{farm.name}</h3>
            <img src={farm.photos[0]} alt={farm.name} />
            <p>{farm.description}</p>
            <h4>Menus:</h4>
            {farm.meals.map(meal => (
              <div key={meal.id} className="meal">
                <h5>{meal.name}</h5>
                <p>{meal.description}</p>
                <p>Price: {meal.price} MAD</p>
                <p>Available: {meal.availability}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookFarm;
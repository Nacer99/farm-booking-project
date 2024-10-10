import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import '../styles/FarmPage.css';

const FarmPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const date = new URLSearchParams(location.search).get('date');
  const [farm, setFarm] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState({});
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // TODO: Fetch farm data from your API
    setFarm({
      id,
      name: "Sample Farm",
      description: "A beautiful farm with great views",
      photo: "https://example.com/farm.jpg",
      meals: [
        { id: 1, name: "Breakfast", description: "Delicious breakfast", price: 50, availability: 10 },
        { id: 2, name: "Lunch", description: "Hearty lunch", price: 75, availability: 15 },
        { id: 3, name: "Dinner", description: "Gourmet dinner", price: 100, availability: 20 },
      ]
    });
  }, [id]);

  useEffect(() => {
    if (farm) {
      const newTotal = Object.entries(selectedMeals).reduce((sum, [mealId, quantity]) => {
        const meal = farm.meals.find(m => m.id === parseInt(mealId));
        return sum + (meal ? meal.price * quantity : 0);
      }, 0);
      setTotal(newTotal);
    }
  }, [selectedMeals, farm]);

  const handleMealSelection = (mealId, quantity) => {
    setSelectedMeals(prev => ({
      ...prev,
      [mealId]: parseInt(quantity)
    }));
  };

  const handleBooking = async () => {
    try {
      // Send booking data to your API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ farmId: id, date, meals: selectedMeals, total }),
      });

      if (response.ok) {
        // Redirect to a confirmation page
        navigate('/booking-confirmation');
      } else {
        // Handle errors
        console.error('Booking failed');
        // TODO: Show an error message to the user
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during booking:', error);
      // TODO: Show an error message to the user
      alert('An error occurred during booking. Please try again.');
    }
  };

  if (!farm) return <div>Loading...</div>;

  return (
    <div className="farm-page">
      <h2>{farm.name}</h2>
      <img src={farm.photo} alt={farm.name} />
      <p>{farm.description}</p>
      <h3>Available Meals for {new Date(date).toLocaleDateString()}</h3>
      {farm.meals.map(meal => (
        <div key={meal.id} className="meal-option">
          <h4>{meal.name} - ${meal.price}</h4>
          <p>{meal.description}</p>
          <label>
            Quantity:
            <input
              type="number"
              min="0"
              max={meal.availability}
              value={selectedMeals[meal.id] || 0}
              onChange={(e) => handleMealSelection(meal.id, e.target.value)}
            />
          </label>
        </div>
      ))}
      <div className="booking-summary">
        <h3>Total: ${total}</h3>
        <button onClick={handleBooking}>Book</button>
      </div>
    </div>
  );
};

export default FarmPage;
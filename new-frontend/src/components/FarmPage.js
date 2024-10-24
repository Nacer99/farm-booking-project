import { API_URL } from '../config';
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

  const fetchFarmDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/farms/${id}`, {
        // Remove the Authorization header since no user is logged in
        // headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch farm details');
      }
      const data = await response.json();
      setFarm(data);
    } catch (error) {
      console.error('Error fetching farm details:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    fetchFarmDetails();
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

  const calculateTotalAmount = () => {
    return total;
  };

  const createBooking = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Remove the Authorization header since no user is logged in
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          farmId: id,
          date: date,
          meals: selectedMeals,
          totalAmount: calculateTotalAmount(),
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create booking');
      }
      const data = await response.json();
      
      // Calculate total number of meals
      const totalMeals = Object.values(selectedMeals).reduce((sum, quantity) => sum + quantity, 0);
      
      // Get names of booked meals
      const bookedMeals = farm.meals
        .filter(meal => selectedMeals[meal.id] > 0)
        .map(meal => meal.name)
        .join(", ");

      // Redirect to confirmation page with booking details
      navigate('/booking-confirmation', { 
        state: { 
          totalMeals, 
          bookedMeals, 
          farmName: farm.name, 
          bookingDate: date,
          bookingId: data.id // Assuming the API returns the booking ID
        } 
      });
    } catch (error) {
      console.error('Error creating booking:', error);
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
        <button onClick={createBooking}>Book</button>
      </div>
    </div>
  );
};

export default FarmPage;
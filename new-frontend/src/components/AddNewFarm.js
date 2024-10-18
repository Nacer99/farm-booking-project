import { API_URL } from '../config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddNewFarm.css';

const AddNewFarm = () => {
  const navigate = useNavigate();
  const [farmData, setFarmData] = useState({
    name: '',
    description: '',
    photos: [],
    meals: [
      { name: '', description: '', availability: 0, price: 0 },
      { name: '', description: '', availability: 0, price: 0 },
      { name: '', description: '', availability: 0, price: 0 }
    ]
  });

  const handleChange = (e, index) => {
    if (e.target.name.startsWith('meal')) {
      const newMeals = [...farmData.meals];
      newMeals[index] = { ...newMeals[index], [e.target.name.split('-')[1]]: e.target.value };
      setFarmData({ ...farmData, meals: newMeals });
    } else {
      setFarmData({ ...farmData, [e.target.name]: e.target.value });
    }
  };

  const handlePhotoUpload = (e) => {
    setFarmData({ ...farmData, photos: [...farmData.photos, ...e.target.files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/farms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(farmData),
      });
      if (!response.ok) {
        throw new Error('Failed to create farm');
      }
      const data = await response.json();
      // Handle successful farm creation
      navigate('/manager');
    } catch (error) {
      console.error('Error creating farm:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="add-new-farm">
      <h2>Add a New Farm</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={farmData.name} onChange={handleChange} placeholder="Farm Name" required />
        <textarea name="description" value={farmData.description} onChange={handleChange} placeholder="Farm Description" required />
        <input type="file" multiple onChange={handlePhotoUpload} accept="image/*" />
        {farmData.meals.map((meal, index) => (
          <div key={index} className="meal-section">
            <h3>Meal {index + 1}</h3>
            <input type="text" name={`meal-name`} value={meal.name} onChange={(e) => handleChange(e, index)} placeholder="Meal Name" required />
            <textarea name={`meal-description`} value={meal.description} onChange={(e) => handleChange(e, index)} placeholder="Meal Description" required />
            <input type="number" name={`meal-availability`} value={meal.availability} onChange={(e) => handleChange(e, index)} placeholder="Availability" required />
            <input type="number" name={`meal-price`} value={meal.price} onChange={(e) => handleChange(e, index)} placeholder="Price in MAD" required />
          </div>
        ))}
        <button type="submit">Confirm and List Farm</button>
      </form>
    </div>
  );
};

export default AddNewFarm;
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmData({ ...farmData, [name]: value });
  };

  const handleMealChange = (index, field, value) => {
    const newMeals = [...farmData.meals];
    newMeals[index] = {
      ...newMeals[index],
      [field]: field === 'price' || field === 'availability' ? Number(value) : value
    };
    setFarmData({ ...farmData, meals: newMeals });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFarmData({ ...farmData, photos: files });
  };

  const validateForm = () => {
    if (!farmData.name || !farmData.description) {
      throw new Error('Farm name and description are required');
    }

    if (farmData.photos.length === 0) {
      throw new Error('At least one photo is required');
    }

    const invalidMeals = farmData.meals.some(
      meal => !meal.name || !meal.description || meal.price <= 0 || meal.availability < 0
    );

    if (invalidMeals) {
      throw new Error('All meals must have valid name, description, price, and availability');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form data
      validateForm();

      // Create FormData object
      const formData = new FormData();
      formData.append('name', farmData.name);
      formData.append('description', farmData.description);
      
      // Append each photo individually
      farmData.photos.forEach((photo, index) => {
        formData.append(`photos`, photo);
      });

      // Append meals as an array of objects
      farmData.meals.forEach((meal, index) => {
        Object.keys(meal).forEach(key => {
          formData.append(`meals[${index}][${key}]`, meal[key]);
        });
      });

      const response = await fetch(`${API_URL}/api/farms`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create farm');
      }

      const data = await response.json();
      console.log('Farm created successfully:', data);
      navigate('/manager');
    } catch (error) {
      console.error('Error creating farm:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-new-farm">
      <h2>Add a New Farm</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={farmData.name}
          onChange={handleChange}
          placeholder="Farm Name"
          required
        />
        <textarea
          name="description"
          value={farmData.description}
          onChange={handleChange}
          placeholder="Farm Description"
          required
        />
        <input
          type="file"
          multiple
          onChange={handlePhotoUpload}
          accept="image/*"
          required
        />
        {farmData.meals.map((meal, index) => (
          <div key={index} className="meal-section">
            <h3>Meal {index + 1}</h3>
            <input
              type="text"
              value={meal.name}
              onChange={(e) => handleMealChange(index, 'name', e.target.value)}
              placeholder="Meal Name"
              required
            />
            <textarea
              value={meal.description}
              onChange={(e) => handleMealChange(index, 'description', e.target.value)}
              placeholder="Meal Description"
              required
            />
            <input
              type="number"
              value={meal.availability}
              onChange={(e) => handleMealChange(index, 'availability', e.target.value)}
              placeholder="Availability"
              min="0"
              required
            />
            <input
              type="number"
              value={meal.price}
              onChange={(e) => handleMealChange(index, 'price', e.target.value)}
              placeholder="Price in MAD"
              min="0"
              required
            />
          </div>
        ))}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Farm...' : 'Confirm and List Farm'}
        </button>
      </form>
    </div>
  );
};

export default AddNewFarm;
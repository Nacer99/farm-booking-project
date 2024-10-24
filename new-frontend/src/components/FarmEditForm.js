// eslint-disable-next-line no-unused-vars
import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/FarmEditForm.css';

const FarmEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);

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
      // Handle error
    }
  };

  useEffect(() => {
    fetchFarmDetails();
  }, [id]);

  const handleChange = (e, index) => {
    if (e.target.name.startsWith('meal')) {
      const newMeals = [...farm.meals];
      newMeals[index] = { ...newMeals[index], [e.target.name.split('-')[1]]: e.target.value };
      setFarm({ ...farm, meals: newMeals });
    } else {
      setFarm({ ...farm, [e.target.name]: e.target.value });
    }
  };

  const handlePhotoUpload = (e) => {
    setFarm({ ...farm, photos: [...farm.photos, ...e.target.files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/farms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Remove the Authorization header since no user is logged in
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(farm),
      });
      if (!response.ok) {
        throw new Error('Failed to update farm');
      }
      await response.json();
      // Handle successful farm update (e.g., show success message, redirect)
      navigate('/edit-farm');
    } catch (error) {
      console.error('Error updating farm:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      try {
        const response = await fetch(`${API_URL}/api/farms/${id}`, {
          method: 'DELETE',
          // Remove the Authorization header since no user is logged in
          // headers: {
          //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // },
        });
        if (!response.ok) {
          throw new Error('Failed to delete farm');
        }
        navigate('/edit-farm');
      } catch (error) {
        console.error('Error deleting farm:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  if (!farm) return <div>Loading...</div>;

  return (
    <div className="farm-edit-form">
      <h2>Edit Farm: {farm.name}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={farm.name} onChange={handleChange} placeholder="Farm Name" required />
        <textarea name="description" value={farm.description} onChange={handleChange} placeholder="Farm Description" required />
        <input type="file" multiple onChange={handlePhotoUpload} accept="image/*" />
        {farm.meals.map((meal, index) => (
          <div key={index} className="meal-section">
            <h3>Meal {index + 1}</h3>
            <input type="text" name={`meal-name`} value={meal.name} onChange={(e) => handleChange(e, index)} placeholder="Meal Name" required />
            <textarea name={`meal-description`} value={meal.description} onChange={(e) => handleChange(e, index)} placeholder="Meal Description" required />
            <input type="number" name={`meal-availability`} value={meal.availability} onChange={(e) => handleChange(e, index)} placeholder="Availability" required />
            <input type="number" name={`meal-price`} value={meal.price} onChange={(e) => handleChange(e, index)} placeholder="Price in MAD" required />
          </div>
        ))}
        <button type="submit">Confirm and Update Farm</button>
      </form>
      <button onClick={handleDelete} className="delete-button">Delete this Farm</button>
    </div>
  );
};

export default FarmEditForm;
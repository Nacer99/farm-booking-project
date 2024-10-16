// eslint-disable-next-line no-unused-vars
import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/FarmEditForm.css';

import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function FarmEditForm() {
  const { id } = useParams();
  const [farmData, setFarmData] = useState(null);

  const fetchFarmDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/farms/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch farm details');
      }
      const data = await response.json();
      setFarmData(data);
    } catch (error) {
      console.error('Error fetching farm details:', error);
      // Handle error
    }
  };

  useEffect(() => {
    fetchFarmDetails();
  }, [id]);

  // Rest of your component code, including form and handleSubmit function...
}

const FarmEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);

  useEffect(() => {
    // TODO: Fetch farm data from your API
    // const fetchedFarm = await api.getFarm(id);
    // setFarm(fetchedFarm);
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
    // TODO: Send updated farm data to your API
    // await api.updateFarm(id, farm);
    navigate('/edit-farm');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      // TODO: Send delete request to your API
      // await api.deleteFarm(id);
      navigate('/edit-farm');
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
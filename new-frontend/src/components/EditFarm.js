import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/EditFarm.css';

const EditFarm = () => {
  const [farms, setFarms] = useState([]);
  const [farmData, setFarmData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchFarms();
    if (id) {
      fetchFarmDetails();
    }
  }, [id]);

  const fetchFarms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/farms`, {
        // Remove the Authorization header since no user is logged in
        // headers: {
        //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch farms');
      }
      const data = await response.json();
      setFarms(data);
    } catch (error) {
      console.error('Error fetching farms:', error);
      // Handle error (e.g., show error message to user)
    }
  };

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
      setFarmData(data);
    } catch (error) {
      console.error('Error fetching farm details:', error);
      // Handle error (e.g., show error message to user)
    }
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
        body: JSON.stringify(farmData),
      });
      if (!response.ok) {
        throw new Error('Failed to update farm');
      }
      await response.json();
      // Handle successful farm update (e.g., show success message, redirect)
    } catch (error) {
      console.error('Error updating farm:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDelete = async (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        const response = await fetch(`${API_URL}/api/farms/${farmId}`, {
          method: 'DELETE',
          // Remove the Authorization header since no user is logged in
          // headers: {
          //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // },
        });
        if (!response.ok) {
          throw new Error('Failed to delete farm');
        }
        setFarms(farms.filter(farm => farm.id !== farmId));
        console.log(`Farm with id ${farmId} deleted`);
      } catch (error) {
        console.error("Error deleting farm:", error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  return (
    <div className="edit-farm">
      <h2>Edit or Delete a Farm</h2>
      <ul className="farm-list">
        {farms.map(farm => (
          <li key={farm.id}>
            <span>{farm.name}</span>
            <div className="farm-actions">
              <Link to={`/edit-farm/${farm.id}`} className="edit-button">Edit</Link>
              <button onClick={() => handleDelete(farm.id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {farmData && (
        <form onSubmit={handleSubmit}>
          {/* Add form fields for editing farm data */}
          <button type="submit">Update Farm</button>
        </form>
      )}
      <Link to="/manager" className="back-button">Back to Dashboard</Link>
    </div>
  );
};

export default EditFarm;
// eslint-disable-next-line no-unused-vars
import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/EditFarm.css';

const EditFarm = () => {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    // TODO: Fetch farms from your API
    // For now, we'll use dummy data
    setFarms([
      { id: 1, name: "Green Acres Farm" },
      { id: 2, name: "Sunset Valley Ranch" },
      { id: 3, name: "Mountain View Orchard" },
    ]);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this farm?")) {
      try {
        // TODO: Send delete request to your API
        // For now, we'll just remove it from the local state
        setFarms(farms.filter(farm => farm.id !== id));
        // In a real application, you'd make an API call here:
        // await api.deleteFarm(id);
        console.log(`Farm with id ${id} deleted`);
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
      <Link to="/manager" className="back-button">Back to Dashboard</Link>
    </div>
  );
};

export default EditFarm;
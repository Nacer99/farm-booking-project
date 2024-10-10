import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/EditFarm.css';

const EditFarm = () => {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    // TODO: Fetch farms from your API
    // For now, let's just set some dummy farms
    setFarms([
      { id: 1, name: "Farm 1" },
      { id: 2, name: "Farm 2" },
      { id: 3, name: "Farm 3" },
    ]);
  }, []);

  return (
    <div className="edit-farm">
      <h2>Edit a Farm</h2>
      <ul className="farm-list">
        {farms.map(farm => (
          <li key={farm.id}>
            <span>{farm.name}</span>
            <Link to={`/edit-farm/${farm.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
      <Link to="/manager" className="back-button">Back to Dashboard</Link>
    </div>
  );
};

export default EditFarm;
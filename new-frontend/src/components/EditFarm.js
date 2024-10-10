import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/EditFarm.css';

const EditFarm = () => {
  const [farms, setFarms] = useState([]);

  useEffect(() => {
    // TODO: Fetch farms from your API
    // const fetchedFarms = await api.getFarms();
    // setFarms(fetchedFarms);
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
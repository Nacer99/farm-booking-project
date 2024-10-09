import React, { useState, useEffect } from 'react';

const FarmManagerDashboard = () => {
    const [farms, setFarms] = useState([]);
    const [newFarm, setNewFarm] = useState({ name: '', description: '', menus: [] });

    // Use useEffect to fetch farms when the component mounts
    useEffect(() => {
        fetchFarms();
    }, []); // Empty dependency array means this runs once when the component mounts

    const fetchFarms = async () => {
        const response = await fetch('/api/farms');
        const data = await response.json();
        setFarms(data);
    };

    const handleAddFarm = async () => {
        const response = await fetch('/api/farms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFarm),
        });
        if (response.ok) {
            fetchFarms();
            setNewFarm({ name: '', description: '', menus: [] });
        }
    };

    return (
        <div>
            <h2>Farm Manager Dashboard</h2>
            <h3>Add New Farm</h3>
            <input
                type="text"
                placeholder="Farm Name"
                value={newFarm.name}
                onChange={(e) => setNewFarm({ ...newFarm, name: e.target.value })}
            />
            <textarea
                placeholder="Description"
                value={newFarm.description}
                onChange={(e) => setNewFarm({ ...newFarm, description: e.target.value })}
            />
            <button onClick={handleAddFarm}>Add Farm</button>
            <div className="farm-list">
                {farms.map((farm) => (
                    <div key={farm.id}>
                        <h4>{farm.name}</h4>
                        <button>Edit</button>
                        <button>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FarmManagerDashboard;
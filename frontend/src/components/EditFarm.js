import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/EditFarm.css';

const EditFarm = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [editedFarm, setEditedFarm] = useState(null);

    // Mock data for demonstration purposes
    const mockFarms = [
        {
            id: 1,
            name: 'Green Acres',
            description: 'A beautiful farm with rolling hills',
            photos: ['photo1.jpg', 'photo2.jpg'],
            meals: [
                { name: 'Farm Breakfast', description: 'Fresh eggs and bacon', availability: 10, price: 50 },
                { name: 'Harvest Lunch', description: 'Seasonal vegetables and grilled chicken', availability: 15, price: 75 },
                { name: 'Sunset Dinner', description: 'Grilled steak with roasted potatoes', availability: 20, price: 100 }
            ]
        },
        // Add more mock farms as needed
    ];

    const handleSearch = () => {
        const farm = mockFarms.find(f => f.name.toLowerCase() === searchTerm.toLowerCase());
        setSelectedFarm(farm);
        setEditedFarm(farm ? { ...farm } : null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedFarm(prev => ({ ...prev, [name]: value }));
    };

    const handleMealChange = (index, field, value) => {
        setEditedFarm(prev => {
            const updatedMeals = [...prev.meals];
            updatedMeals[index] = { ...updatedMeals[index], [field]: value };
            return { ...prev, meals: updatedMeals };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the updated farm data to your backend
        console.log('Updated farm:', editedFarm);
        alert('Farm updated successfully!');
        // Reset the form
        setSearchTerm('');
        setSelectedFarm(null);
        setEditedFarm(null);
    };

    return (
        <div className="edit-farm">
            <h2>Edit Existing Farm</h2>
            <div className="search-section">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter farm name"
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {selectedFarm && editedFarm && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        value={editedFarm.name}
                        onChange={handleInputChange}
                        placeholder="Farm Name"
                        required
                    />
                    <textarea
                        name="description"
                        value={editedFarm.description}
                        onChange={handleInputChange}
                        placeholder="Farm Description"
                        required
                    />
                    <div className="photos-section">
                        <h3>Current Photos:</h3>
                        {editedFarm.photos.map((photo, index) => (
                            <div key={index}>{photo}</div>
                        ))}
                        {/* Add photo upload input here */}
                    </div>
                    {editedFarm.meals.map((meal, index) => (
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
                                onChange={(e) => handleMealChange(index, 'availability', parseInt(e.target.value))}
                                placeholder="Availability"
                                required
                            />
                            <input
                                type="number"
                                value={meal.price}
                                onChange={(e) => handleMealChange(index, 'price', parseFloat(e.target.value))}
                                placeholder="Price in MAD"
                                required
                            />
                        </div>
                    ))}
                    <button type="submit" className="submit-button">Confirm and Update Farm</button>
                </form>
            )}

            {selectedFarm === null && searchTerm && (
                <p>No farm found with that name.</p>
            )}

            <Link to="/list" className="back-button">Back to Dashboard</Link>
        </div>
    );
};

export default EditFarm;
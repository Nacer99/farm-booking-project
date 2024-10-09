import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AddNewFarm.css';

const AddNewFarm = () => {
    const navigate = useNavigate();
    const [farm, setFarm] = useState({
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
        // Here you would typically send the farm data to your backend
        console.log(farm);
        // After successful submission, redirect to the farm manager dashboard
        navigate('/list');
    };

    return (
        <div className="add-new-farm">
            <h2>Add a New Farm</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={farm.name}
                    onChange={handleChange}
                    placeholder="Farm Name"
                    required
                />
                <textarea
                    name="description"
                    value={farm.description}
                    onChange={handleChange}
                    placeholder="Farm Description"
                    required
                />
                <input
                    type="file"
                    multiple
                    onChange={handlePhotoUpload}
                    accept="image/*"
                />
                {farm.meals.map((meal, index) => (
                    <div key={index} className="meal-section">
                        <h3>Meal {index + 1}</h3>
                        <input
                            type="text"
                            name={`meal-name`}
                            value={meal.name}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Meal Name"
                            required
                        />
                        <textarea
                            name={`meal-description`}
                            value={meal.description}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Meal Description"
                            required
                        />
                        <input
                            type="number"
                            name={`meal-availability`}
                            value={meal.availability}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Availability"
                            required
                        />
                        <input
                            type="number"
                            name={`meal-price`}
                            value={meal.price}
                            onChange={(e) => handleChange(e, index)}
                            placeholder="Price in MAD"
                            required
                        />
                    </div>
                ))}
                <button type="submit" className="submit-button">Confirm and List Farm</button>
            </form>
            <Link to="/list" className="back-button">Back to Dashboard</Link>
        </div>
    );
};

export default AddNewFarm;
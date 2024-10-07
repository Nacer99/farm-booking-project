import React from 'react';
import MenuCard from './MenuCard';

const FarmCard = ({ farm, onBook }) => {
    const handleBooking = () => {
        const email = prompt('Please enter your email for confirmation:');
        if (email) {
            onBook(farm.id, email);
        }
    };

    return (
        <div className="farm-card">
            <h3>{farm.name}</h3>
            <p>{farm.description}</p>
            <button onClick={handleBooking}>Book Now</button>
            <div className="menu-list">
                {farm.menus.map((menu) => (
                    <MenuCard key={menu.id} menu={menu} />
                ))}
            </div>
        </div>
    );
};

export default FarmCard;
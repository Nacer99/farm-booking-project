import React from 'react';

const MenuCard = ({ menu }) => {
    return (
        <div className="menu-card">
            <h4>{menu.name}</h4>
            <p>{menu.description}</p>
            <p>Price: ${menu.price}</p>
            <p>Available: {menu.availability}</p>
        </div>
    );
};

export default MenuCard;
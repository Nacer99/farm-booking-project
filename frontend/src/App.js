import React from 'react';
import ClientDashboard from './components/ClientDashboard';
import FarmManagerDashboard from './components/FarmManagerDashboard';
import './styles/App.css';

function App() {
    return (
        <div className="App">
            <h1>Tourist Farm Booking</h1>
            <ClientDashboard />
            <FarmManagerDashboard />
        </div>
    );
}

export default App;
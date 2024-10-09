import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import ClientDashboard from './components/ClientDashboard';
import FarmManagerDashboard from './components/FarmManagerDashboard';
import AddNewFarm from './components/AddNewFarm';
import EditFarm from './components/EditFarm';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<ClientDashboard />} />
          <Route path="/list" element={<FarmManagerDashboard />} />
          <Route path="/add-farm" element={<AddNewFarm />} />
          <Route path="/edit-farm" element={<EditFarm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
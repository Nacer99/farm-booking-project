import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import BookFarm from './components/BookFarm';
import FarmPage from './components/FarmPage';
import BookingConfirmation from './components/BookingConfirmation';
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
          <Route path="/book" element={<BookFarm />} />
          <Route path="/farm/:id" element={<FarmPage />} />
          <Route path="/booking-confirmation" element={<BookingConfirmation />} />
          <Route path="/manager" element={<FarmManagerDashboard />} />
          <Route path="/add-farm" element={<AddNewFarm />} />
          <Route path="/edit-farm" element={<EditFarm />} />
          <Route path="/edit-farm/:id" element={<EditFarm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
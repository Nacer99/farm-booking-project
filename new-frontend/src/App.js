import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import BookFarm from './components/BookFarm';
import FarmManagerDashboard from './components/FarmManagerDashboard';
import AddNewFarm from './components/AddNewFarm';
import EditFarm from './components/EditFarm';
import FarmEditForm from './components/FarmEditForm';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/book" element={<BookFarm />} />
          <Route path="/manager" element={<FarmManagerDashboard />} />
          <Route path="/add-farm" element={<AddNewFarm />} />
          <Route path="/edit-farm" element={<EditFarm />} />
          <Route path="/edit-farm/:id" element={<FarmEditForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
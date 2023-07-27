import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import NoPage from './Components/NoPage';
import Home from './Components/Home'; 
import Dashboard from './Components/Dashboard';

function App() {
  return (
    <div>
     
  
      <Routes>
      
        <Route path="/" element={<Home />} /> 
        <Route path="Home" element={<Home />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
        <Route path="*" element={<NoPage />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
      
    </div>
  );
}

export default App;

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import MapPage from './components/Pages/MapPage';
import ServiceStationsPage from './components/Pages/ServiceStationsPage';
import AboutPage from './components/Pages/AboutPage';
import RegistrationPage from './components/Pages/RegistrationPage';
import AdminLoginPage from './components/Pages/AdminLoginPage';
import AdminPanel from './components/Pages/AdminPanel';
import Navbar from './components/Navbar/Navbar';
import ServiceStationLogin from './components/ServiceLogin/ServiceLogin';

const App = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/servicestations" element={<ServiceStationsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/servicestations/login" element={<ServiceStationLogin />} />
      </Routes>
    </Router>
  )
}

export default App
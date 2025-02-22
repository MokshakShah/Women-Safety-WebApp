import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import EmergencyContacts from './components/EmergencyContacts';
import FamilyContacts from './components/FamilyContacts';
import PhotoUpload from './components/PhotoUpload';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Router>
            <div className="app">
                <header className="header">
                    <div className="drop">
                        <h1><img src="/logo.png" alt="HerShield Logo" className="logo" />HerShield</h1>
                    </div>

                    <button onClick={toggleSidebar} className="sidebtn">
                        {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
                    </button>
                </header>

                <div className="content">
                    {isSidebarOpen && <Sidebar />}
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/emergency-contacts" element={<EmergencyContacts />} />
                        <Route path="/family-contacts" element={<FamilyContacts />} />
                        <Route path="/photo-upload" element={<PhotoUpload />} />
                    </Routes>
                </div>

                <footer className="footer">
                    <img src="/logo.png" alt="HerShield Logo" className="logo" />
                    <p>&copy; 2025 HerShield</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;

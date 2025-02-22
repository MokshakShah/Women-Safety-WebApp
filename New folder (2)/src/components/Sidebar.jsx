import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>HerShield</h2>
      <ul>
        <li><Link to="/settings">Settings</Link></li>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/feedback">Feedback</Link></li>
        <li><a href="#">Logout</a></li>
      </ul>
    </div>
  );
}

export default Sidebar;

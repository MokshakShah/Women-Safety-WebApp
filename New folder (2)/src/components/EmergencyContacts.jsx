import React from 'react';
import './EmergencyContacts.css';

function EmergencyContacts() {
  return (
    <div className="emergency-contacts">
      <h3>Police:</h3>
      <a href="tel:100" className="phone-button">100</a>
      <h3>Hospital:</h3>
      <a href="tel:102" className="phone-button">102</a>
      <h3>Women Helpline:</h3>
      <a href="tel:1091" className="phone-button">1091</a>
    </div>
  );
}

export default EmergencyContacts;

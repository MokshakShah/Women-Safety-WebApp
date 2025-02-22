import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FamilyContacts.css';

function FamilyContacts() {
    const [contacts, setContacts] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [phoneError, setPhoneError] = useState(''); // New state for phone error

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/api/family-contacts');
            if (Array.isArray(response.data)) {
                setContacts(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setContacts(response.data.data);
            } else {
                throw new Error('Invalid data format from API');
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPhoneError(''); // Clear previous phone error
        setError(null);
        setSuccessMessage('');

        if (phone.length !== 10 || !/^\d+$/.test(phone)) { // Check if phone is exactly 10 digits
            setPhoneError('Phone number must be exactly 10 digits.');
            return; // Stop submission
        }

        try {
            const response = await axios.post('http://localhost:5000/api/family-contacts', { name, phone });
            if (response.status === 201) {
                setSuccessMessage('Contact added successfully!');
                setName('');
                setPhone('');
                fetchContacts();
            } else {
                throw new Error(`Failed to add contact: ${response.status}`);
            }
        } catch (error) {
            console.error('Error adding contact:', error);
            setError(error);
        }
    };

    if (loading) {
        return <p>Loading family contacts...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className="family-contacts-container">
            <h3>Add Family Contact:</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                {phoneError && <p className="error-message">{phoneError}</p>} {/* Display phone error */}
                <button type="submit">Add Contact</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            <h3>Family Contacts:</h3>
            <ul className="contacts-list">
                {contacts.map(contact => (
                    <li key={contact._id} className="contact-item">
                        {contact.name} - {contact.phone}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FamilyContacts;

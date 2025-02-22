import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import twilio from 'twilio';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/HerShield')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Twilio Setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twilioClient = twilio(accountSid, authToken);

console.log("Twilio Account SID:", accountSid);
console.log("Twilio Auth Token:", authToken);
console.log("Twilio Phone Number:", twilioPhoneNumber);

// Schemas
const familyContactSchema = new mongoose.Schema({
    name: String,
    phone: String,
});
const FamilyContact = mongoose.model('FamilyContact', familyContactSchema);

const textMessageSchema = new mongoose.Schema({
    text: String,
    timestamp: Date,
});
const TextMessage = mongoose.model('TextMessage', textMessageSchema, 'Message');

// Message Model
const Message = mongoose.model('Message', textMessageSchema);

// Twilio Function
async function sendSMS(to, message) {
    try {
        await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: to
        });
        console.log(`SMS sent to ${to}`);
    } catch (error) {
        console.error(`Error sending SMS to ${to}:`, error);
    }
}

// Routes
app.post('/api/family-contacts', async (req, res) => {
    try {
        const { name, phone } = req.body;

        // Add India country code
        const indiaCountryCode = '+91';
        const phoneWithCountryCode = indiaCountryCode + phone;

        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
        }

        const newContact = new FamilyContact({ name, phone: phoneWithCountryCode });
        await newContact.save();
        console.log("Family Contact Saved!");
        res.status(201).json({ message: 'Contact added successfully' });
    } catch (error) {
        console.error('Error adding family contact:', error);
        res.status(500).json({ message: 'Error adding family contact' });
    }
});

app.get('/api/family-contacts', async (req, res) => {
    try {
        const contacts = await FamilyContact.find();
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching family contacts:', error);
        res.status(500).json({ message: 'Error fetching family contacts' });
    }
});

app.post('/api/sos', async (req, res) => {
    try {
        const { text } = req.body;

        // Store the message in MongoDB
        const newMessage = new Message({ text: text, timestamp: new Date() });
        await newMessage.save();

        console.log("SOS message stored in MongoDB");

        // Send SMS to all family contacts
        const contacts = await FamilyContact.find();
        const smsMessage = `SOS Text Message: ${text}`;

        for (const contact of contacts) {
            await sendSMS(contact.phone, smsMessage);
        }

        res.status(201).json({ message: 'SOS text message stored and sent successfully.' });
    } catch (error) {
        console.error('Error sending text SOS message:', error);
        res.status(500).json({ message: 'Error sending text SOS message', error: error.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const app = express();

const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'Barangay R.M. Tan Management System API' });
});

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/profile-settings', require('./routes/residentProfileSettingsRoutes'));
app.use('/api/v1/announcements', require('./routes/announcementRoutes'));
app.use('/api/v1/waste-schedules', require('./routes/wasteScheduleRoutes'));
app.use('/api/v1/disaster-alerts', require('./routes/disasterAlertRoutes'));
app.use('/api/v1/document-requests', require('./routes/documentRequestRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

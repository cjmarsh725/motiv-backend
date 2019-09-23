require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes are located in controllers using their own routers
const userRoutes = require('./users/userRoutes');
const reminderRoutes = require('./reminders/reminderRoutes');
const appointmentRoutes = require('./appointments/appointmentRoutes');
const fileRoutes = require('./files/fileRoutes');

// Flag set to prevent warnings
mongoose.set('useCreateIndex', true);
// Connect to the database using the url env variable
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(mongo => console.log('Connected to DB'))
  .catch(err => console.log('Error connecting to DB', err))
// Set up the server and assign port from env variable
const server = express();
const port = process.env.PORT || 5000;
// Direct server to use middleware
server.use(express.json());
server.use(helmet());
server.use(cors({}));

// Basic root route for testing
server.get('/', (req, res) => {
  res.json({Message: `Server listening on port ${port}`});
})

// Direct server to use the route controllers
server.use('/users', userRoutes);
server.use('/reminders', reminderRoutes);
server.use('/appointments', appointmentRoutes);
server.use('/files', fileRoutes);

// Start the server
server.listen(port, err => {
  if (err) console.log(err);
  else console.log(`Server listening on port ${port}`);
})
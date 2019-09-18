require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./users/userRoutes');
const reminderRoutes = require('./reminders/reminderRoutes');
const appointmentRoutes = require('./appointments/appointmentRoutes');

mongoose.set('useCreateIndex', true);
mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(mongo => console.log('Connected to DB'))
  .catch(err => console.log('Error connecting to DB', err))

const server = express();
const port = process.env.PORT || 5000;

server.use(express.json());
server.use(helmet());
server.use(cors({}));

server.get('/', (req, res) => {
  res.json({Message: `Server listening on port ${port}`});
})

server.use('/users', userRoutes);
server.use('/reminders', reminderRoutes);
server.use('/appointments', appointmentRoutes);

server.listen(port, err => {
  if (err) console.log(err);
  else console.log(`Server listening on port ${port}`);
})
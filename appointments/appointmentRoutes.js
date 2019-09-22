const express = require('express');
const router = express.Router();
const moment = require('moment');
const { authenticate } = require('../utils/authenticate');
const Appointment = require('./Appointment');

/*
This is the sub-router that handles the routes responsible for dealing with appointments,
including retrieving them all sorted by date, adding a new one, and deleting one or all of them.
*/

// Route responsible for retrieving all the appointments of a user, sorted by date
router.get('/', authenticate, (req, res) => { 
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    Appointment.find({ userid: req.decoded.userid })
      .then(appointments => {
        // Sorts the array by the date property using moment
        appointments.sort((a, b) => {
          const m1 = moment(a.date);
          const m2 = moment(b.date);
          return m1 - m2;
        })
        res.json(appointments)
      })
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

// Route responsible for adding a new appointment for a user
router.post('/add', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { label, date } = req.body;
    const { userid } = req.decoded;
    // Ensures that both label and date fields were included in the request body
    if (!label || !date) {
      res.status(422).json({ msg: 'Must include label and date fields' });
      return;
    }
    // Regex to partially match date and ensure it includes a time
    const regex = /[0-9]+-[0-9]+-[0-9]+\s[0-9]+:[0-9]+\s[AP]M/;
    // Check to see if the date satisfies the regex and is a valid moment date
    if (!regex.test(date) || !moment(date, 'MM-DD-YYYY h:mm A').isValid()) {
      res.status(422).json({ msg: 'Invalid date' });
      return;
    }
    // Creates a new appointment and saves it to the db
    const appointmentData = { label, date, userid };
    const appointment = new Appointment(appointmentData);
    appointment.save()
      .then(appointment => res.status(201).json(appointment))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

// Route responsible for deleting appointments based on the array of ids passed in the request
router.post('/delete', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { userid } = req.decoded;
    const { ids } = req.body;
    // Ensures the ids property exists and is an array
    if (!Array.isArray(ids)) {
      res.status(422).json({ msg: 'Must include array of ids to be deleted' });
      return;
    }
    // Deletes appointments based on ids for the user
    Appointment.deleteMany({ userid, _id: { $in: ids }})
      .then(appointments => res.json({ msg: ids.length + ' appointments deleted' }))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

// Route responsible for deleting all the appointments for a given user
router.post('/deleteall', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { userid } = req.decoded;
    // Deletes all appointments for the user
    Appointment.deleteMany({ userid })
      .then(appointments => res.json({ msg: 'All appointments deleted' }))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

module.exports = router;
const express = require('express');
const router = express.Router();
const moment = require('moment');
const { authenticate } = require('../utils/authenticate');
const Appointment = require('./Appointment');

router.get('/', authenticate, (req, res) => { 
  if (req.decoded) {
    Appointment.find({ userid: req.decoded.userid })
      .then(appointments => {
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

router.post('/add', authenticate, (req, res) => {
  if (req.decoded) {
    const { label, date } = req.body;
    if (!label || !date) {
      res.status(422).json({ msg: 'Must include label and date fields' });
      return;
    }
    const appointmentData = { label, date, userid: req.decoded.userid };
    const appointment = new appointment(appointmentData);
    appointment.save()
      .then(appointment => res.status(201).json(appointment))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

module.exports = router;
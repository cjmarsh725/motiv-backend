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

module.exports = router;
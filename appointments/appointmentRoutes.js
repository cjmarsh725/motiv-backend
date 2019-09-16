const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/authenticate');
const Appointment = require('./Appointment');

router.get('/', authenticate, (req, res) => { 
  if (req.decoded) {
    Appointment.find({ userid: req.decoded.userid })
      .then(appointments => {
        res.json(appointments)
      })
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

module.exports = router;
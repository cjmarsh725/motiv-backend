const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/authenticate');
const Reminder = require('./Reminder');

router.get('/', authenticate, (req, res) => { 
  if (req.decoded) {
    Reminder.find({ userid: req.decoded.id })
      .then(reminders => res.json(reminders))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

module.exports = router;
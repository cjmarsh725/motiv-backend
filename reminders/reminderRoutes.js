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

router.post('/add', authenticate, (req, res) => {
  if (req.decoded) {
    const { content } = req.body;
    const { id } = req.decoded;
    Reminder.find({ userid: id }, null, { sort: { order: 'desc' }}).then(reminders => {
      const id = reminders.length === 0 ? 0 : reminders[0].id + 1;
      const reminderData = { content: content, id: id, userid: id };
      const reminder = new Reminder(reminderData);
      reminder.save()
        .then(reminder => res.status(201).json(reminder))
        .catch(err => res.status(500).json(err));
    }).catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

module.exports = router;
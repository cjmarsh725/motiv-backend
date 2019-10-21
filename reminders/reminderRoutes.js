const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/authenticate');
const Reminder = require('./Reminder');

/*
This is the sub-router that handles the routes responsible for dealing with reminders,
including retrieving them all, adding a new one, switching the content of two reminders,
and deleting one or all of them.
*/

// Route responsible for retrieving all the reminders of a user
router.get('/', authenticate, (req, res) => { 
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    // Finds all documents with the given userid and returns them in the response
    Reminder.find({ userid: req.decoded.userid })
      .then(reminders => {
        reminders.sort((a, b) => b.id - a.id);
        res.json(reminders);
      })
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

// Route responsible for adding a new reminder for a user
router.post('/add', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { content } = req.body;
    const { userid } = req.decoded;
    // All the reminders for the user are sorted by order to get the next highest order value
    Reminder.find({ userid }, null, { sort: { order: 'desc' }}).then(reminders => {
      // Sorts the reminders by id to make the first reminder the one with the highest id
      reminders.sort((a, b) => b.id - a.id);
      // Sets reminderid to 0 or one higher than the previously highest order value
      const id = reminders.length === 0 ? 0 : reminders[0].id + 1;
      const reminderData = { content, id, userid };
      const reminder = new Reminder(reminderData);
      // Saves the new reminder to the db
      reminder.save()
        .then(reminder => res.status(201).json(reminder))
        .catch(err => res.status(500).json(err));
    }).catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization' });
  }
})

// Route responsible for swapping the content of two reminders to simulate moving them
router.post('/move', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    // Body includes two ids to swap
    const { movedFrom, movedTo } = req.body;
    const { userid } = req.decoded;
    // Gets the two reminders based on the given ids
    Reminder.find({ userid: userid, $or: [{id: movedTo},{id: movedFrom}] }).then(reminders => {
      // Swaps the content of the reminders with a temp variable
      const temp = reminders[0].content;
      reminders[0].content = reminders[1].content;
      reminders[1].content = temp;
      // Saves both reminders to the db
      reminders[0].save();
      reminders[1].save();
      res.json({ msg: 'Move successfully completed' });
    }).catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization' });
  }
})

// Route responsible for deleting a single reminder for a user
router.post('/delete', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { id } = req.body;
    const { userid } = req.decoded;
    // Finds and deletes the reminder with the given userid and id
    Reminder.findOneAndDelete({ userid, id }).then(reminder => {
      if (reminder) res.json({ msg: 'Reminder deleted' });
      else res.status(422).json({ msg: 'Invalid id'});
    }).catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization' });
  }
})

// Route responsible for deleting all of the reminders for a user
router.post('/deleteall', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { userid } = req.decoded;
    // Deletes all reminders with the given userid
    Reminder.deleteMany({ userid })
      .then(reminders => res.json({ msg: 'All reminders deleted' }))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization' });
  }
})

module.exports = router;
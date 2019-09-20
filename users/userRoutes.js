require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticate } = require('../utils/authenticate');
const User = require('./User');

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const userData = { username, password };
  const user = new User(userData);
  user.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err));
})

router.post('/signin', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Invalid Username/Password'});
      return;
    }
    if (user === null) {
      res.status(422).json({ error: 'No user with that username in the database'});
      return;
    }
    user.checkPassword(password, (nonMatch, hashMatch) => {
      if (nonMatch !== undefined) {
        res.status(422).json({ error: 'Passwords dont match'});
        return;
      }
      if (hashMatch) {
        const payload = {
          username: user.username,
          userid: user._id
        }
        const token = jwt.sign(payload, process.env.SECRET);
        res.json({ token });
      } else {
        res.status(500).json({ error: 'There was an error processing the password' });
      }
    })
  })
})

router.post('/delete', authenticate, (req, res) => {
  if (req.decoded) {
    const { userid } = req.decoded;
    User.findOneAndDelete({ _id: userid })
      .then(user => res.json({ msg: 'User deleted' }))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization' });
  }
})

module.exports = router;
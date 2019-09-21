require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { authenticate } = require('../utils/authenticate');
const User = require('./User');

/*
This is the sub-router that handles the routes responsible for dealing with users,
including signing up, signing in, and deleting a user permanently.
*/

// Route responsible for signup, requires a unique username and a password
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const userData = { username, password };
  const user = new User(userData);
  user.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err));
})

// Route responsible for signin, validates given username and password and returns jwt
router.post('/signin', (req, res) => {
  const { username, password } = req.body;
  // Looks for the username in the db to check if its valid
  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(403).json({ error: 'Invalid Username/Password'});
      return;
    }
    if (user === null) {
      res.status(422).json({ error: 'No user with that username in the database'});
      return;
    }
    // Uses the bcrypt checking function defined in the model to compare passwords
    user.checkPassword(password, (nonMatch, hashMatch) => {
      if (nonMatch !== undefined) {
        res.status(422).json({ error: 'Passwords dont match'});
        return;
      }
      // If the stored password hash is a match to the supplied one:
      if (hashMatch) {
        // Payload includes mongo _id of the user for use in other routes
        const payload = {
          username: user.username,
          userid: user._id
        }
        // The token is constructed from the secret and payload then sent in the response
        const token = jwt.sign(payload, process.env.SECRET);
        res.json({ token });
      } else {
        res.status(500).json({ error: 'There was an error processing the password' });
      }
    })
  })
})

// Route responsible for deleting a user from the database
router.post('/delete', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { userid } = req.decoded;
    // Deletes the user based on the supplied id
    User.findOneAndDelete({ _id: userid })
      .then(user => res.json({ msg: 'User deleted' }))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization' });
  }
})

module.exports = router;
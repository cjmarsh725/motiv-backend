const express = require('express');
const router = express.Router();
const User = require('./User');

router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const userData = { username, password };
  const user = new User(userData);
  user.save()
    .then(user => res.status(201).json(user))
    .catch(err => res.status(500).json(err));
})

module.exports = router;
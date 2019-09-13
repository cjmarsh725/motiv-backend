const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/authenticate');
const Reminder = require('./Reminder');

router.get('/', authenticate, (req, res) => {
  console.log(req.decoded);
  res.json({ msg: 'this is a test' });
})

module.exports = router;
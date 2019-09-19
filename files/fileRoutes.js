const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/authenticate');
const File = require('./File');

router.get('/', authenticate, (req, res) => { 
  if (req.decoded) {
    File.findOne({ userid: req.decoded.userid })
      .then(file => res.json(file))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

module.exports = router;
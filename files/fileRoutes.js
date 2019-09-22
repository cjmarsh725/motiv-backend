const express = require('express');
const router = express.Router();
const { authenticate } = require('../utils/authenticate');
const File = require('./File');

/*
This is the sub-router that handles the routes responsible for dealing with files,
including retrieving the file for a given user, adding a new one, updating a file,
and deleting one.
*/

// Route responsible for retrieving the unique file for the provided userid
router.get('/', authenticate, (req, res) => { 
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { userid } = req.decoded;
    // Gets the unique file for the userid and returns it
    File.findOne({ userid })
      .then(file => res.json(file))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization'});
  }
})

// Route responsible for adding a new file for a user if it doesn't exist yet
router.post('/add', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { fileStructure } = req.body;
    const { userid } = req.decoded;
    // Creates a new file based on the provided data and saves it to the db
    const file = new File({ userid, fileStructure });
    file.save()
      .then(file => res.status(201).json(file))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization' });
  }
})

// Route responsible for updating the file of a given user
router.post('/update', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { fileStructure } = req.body;
    const { userid } = req.decoded;
    // Updates the unique file of a user with the provided fileStructure
    File.findOneAndUpdate({ userid }, { fileStructure })
      .then(file => res.json({ msg: 'File structure updated' }))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization' });
  }
})

// Route responsible for deleting the unique file of a user
router.post('/delete', authenticate, (req, res) => {
  // The decoded property exists if the jwt was successfully parsed from the auth header
  if (req.decoded) {
    const { userid } = req.decoded;
    File.findOneAndDelete({ userid })
      .then(file => res.json({ msg: 'File structure deleted' }))
      .catch(err => res.status(500).json(err));
  } else {
    res.status(422).json({ msg: 'Invalid authorization' });
  }
})

module.exports = router;
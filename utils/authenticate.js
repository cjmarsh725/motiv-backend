require('dotenv').config();
const jwt = require('jsonwebtoken');

/*
Middleware that handles the json web token decoding. The jwt's payload is used to store
a userid that is in turn used to retrieve relevant documents from the database. This
auth middleware is used in the routes that require the userid to operate.
*/

const authenticate = (req, res, next) => {
  // In a request the token is placed in the header labeled Authorization
  const token = req.get('Authorization');
  if (token) {
    // Checks to verify the token is legitimate using the secret
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) return res.status(422).json(err);
      req.decoded = decoded;
      next();
    });
  } else {
    // Routes that use this middleware require the token to be present
    return res.status(403).json({
      error: 'No token provided, must be set on the Authorization Header'
    });
  }
};

module.exports = {
  authenticate
};
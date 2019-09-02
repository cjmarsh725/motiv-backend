const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

//const remindersRouter = require('./reminders/remindersRouter');

const server = express();
const port = process.env.PORT || 5000;

server.use(express.json());
server.use(helmet());
server.use(cors({}));

server.get('/', (req, res) => {
  res.json({Message: `Server listening on port ${port}`});
})

//server.use('/reminders', remindersRouter);

server.listen(port, err => {
  if (err) console.log(err);
  else console.log(`Server listening on port ${port}`);
})
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var passport = require('passport');

const User = require('./models/User');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://mdeghaud:Kimbomaye67@marsupilami.315yy.mongodb.net/Marsupilami?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use(express.json())
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

app.use('/api', userRoutes);

module.exports = app;
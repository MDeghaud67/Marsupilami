const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var passport = require('passport');
var mongoose = require('mongoose');

const User = require('../models/User');

exports.register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User();
            user.firstName = req.body.firstName,
            user.lastName = req.body.lastName,
            user.age = req.body.age,
            user.family = req.body.family,
            user.race = req.body.race,
            user.food = req.body.food,
            user.email = req.body.email
                //password: hash
            user.setPassword(req.body.password);
            
            User.findOne({email:req.body.email}).then(user1=>{
                if(user1){
                  return res.status(401).json({
                    message: "User Already Exist"
                  })
                }
            user.save()
                .then(error => {
                    var token;
                    token = user.generateJwt();
                    res.status(201).json({ "token" : token })
                })
                .catch(error => res.status(400).json({ error }));
        })
    })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    passport.authenticate('local', function(err, user, info){
        var token;
    
        // If Passport throws/catches an error
        if (err) {
          res.status(404).json(err);
          return;
        }
    
        // If a user is found
        if(user){
          token = user.generateJwt();
          res.status(200);
          res.json({
            "token" : token
          });
        } else {
          // If user is not found
          res.status(401).json(info);
        }
      })(req, res);
};

exports.getOne = (req, res, next) => {
    User.findOne({ _id: req.params.id }).then(
        (user) => {
            res.status(200).json(user);
        }
    ).catch(
        (error) => {
            res.status(404).json({ error });
        }
    );
};

exports.update = (req, res, next) => {
    const user = new User({
        _id: req.params.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        family: req.body.family,
        race: req.body.race,
        food: req.body.food,
        email: req.body.email,
        password: req.body.password
    });
    User.updateOne({_id: req.params.id}, user).then(
        () => {
            res.status(201).json({ message: 'User updated succesfully !' });
        }
    ).catch(
        (error) => {
            res.status(400).json({ error });
        }
    );
};
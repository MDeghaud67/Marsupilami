const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                age: req.body.age,
                family: req.body.family,
                race: req.body.race,
                food: req.body.food,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(error => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user){
                return res.status(401).json({ message: 'Utilisateur non trouvé!' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({ message: 'Mot de passe incorrect!' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));

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
//on importe le modèle
var Model = require('../models/User');
const config = require('dotenv').config();
const jwt = require('jsonwebtoken');
const keyValueToken = process.env.key_value_token;
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
var dayDate = new Date();
var date = dayDate.getFullYear()+'-'+(dayDate.getMonth()+1)+'-'+dayDate.getDate();
var hours = dayDate.getHours() + ":" + dayDate.getMinutes() + ":" + dayDate.getSeconds();
var fullDate = date+' '+hours;
console.log(fullDate);

//recherche de tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
    Model.User.findAll().then(users => {
        //on récupère ici un tableau "users" contenant une liste d'utilisateurs
        res.status(200).json(users);
        console.log(users);
    }).catch(function (e) {
        //gestion erreur
        res.status(400).json(users);
        console.log(e);
    })
};

exports.login = (req, res, next) => {
    Model.User.findOne({where: { email: req.body.email }})
      .then(User => {
        if (User.email!==req.body.email) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        else {
            bcrypt.compare(req.body.password, User.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({error: 'Mot de passe non valide'});
                }
                res.status(200).json({
                    userId: User.id,
                    token: jwt.sign({ userId: User.id }, keyValueToken, { expiresIn: '24h' })
                });
            })
            .catch(error => res.status(502).json({ error }));
          }
      })
      .catch(error => res.status(501).json({ error }));
};

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            try {
                Model.User.create({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    bio: req.body.bio,
                    pictureURL: req.body.pictureURL,
                    roleId: 1,
                    creationDate: fullDate,
                    updateDate: fullDate
                })
                .then(res.status(201).json({ message: 'Utilisateur créé !' }))          //TODO Comment gérer l'erreur d'unicité dans la bdd ?
                .catch(res.status(401).json({ message: 'Utilisateur non créé !' }));
            } catch {error => res.status(400).json({ error })};
        })
        .catch(error => res.status(500).json({ error }));
};

exports.readProfile = (req, res, next) => {
    Model.User.findOne({ id: req.body.id })
    .then(User => {
      if (User.id!=req.body.id) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      else {
        res.status(200).json(User);
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.updateProfile = (req, res, next) => {

    try {
        Model.User.update(
            {username: req.body.username,
                email: req.body.email,
                bio: req.body.bio,
                pictureURL: req.body.pictureURL,
                creationDate: fullDate,
                updateDate: fullDate},
            {where: {id: req.body.id}}
        ).then(res.status(201).json({ message: 'Utilisateur modifié !' }))  
        //traitement terminé...
        .catch(res.status(401).json({ message: 'Une erreur est apparue !' }));
        }
    catch {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
};

exports.deleteProfile = (req, res, next) => { 
    try {
        Model.User.destroy(
            {where: {id: req.body.id}}
        ).then(res.status(201).json({ message: 'Utilisateur supprimé !' }))  
        //traitement terminé...
        .catch(res.status(401).json({ message: 'Une erreur est apparue !' }));
        }
    catch {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
};
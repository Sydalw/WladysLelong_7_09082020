const config = require('dotenv').config();
const jwt = require('jsonwebtoken');
const keyValueToken = process.env.key_value_token;
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const fs = require('fs');

var db = require('../lib/models/index.js');


//recherche de tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
    db.User.findAll({
        attributes: ['id','name','surname','username','createdAt', 'pictureURL','roleId'],
        include: [{model: db.Role, raw: true}]
    })
    .then(users => {                 
        //on récupère ici un tableau "users" contenant une liste d'utilisateurs
        res.status(200).json(users);
    })
    .catch(function (e) {
        //gestion erreur
        res.status(400).json(users);
        console.log(e);
    })
};

exports.login = (req, res, next) => {
    db.User.findOne({where: { email: req.body.email }})
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
                var dayDate = new Date();
                var date = dayDate.getFullYear()+'-'+(dayDate.getMonth()+1)+'-'+dayDate.getDate();
                var hours = dayDate.getHours() + ":" + dayDate.getMinutes() + ":" + dayDate.getSeconds();
                var fullDate = date+' '+hours;
                return db.User.create({
                    username: req.body.username,
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: hash,
                    bio: req.body.bio,
                    pictureURL: req.body.pictureURL,
                    roleId: 1,
                    createdAt: fullDate,
                    updatedAt: fullDate
                })
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))          
                .catch((error) => res.status(401).json({ message: 'Une erreur est apparue!', error}));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.readProfile = (req, res, next) => {
    db.User.findOne({
        where :{ id: req.params.id },
        attributes: ['id','name','surname','username','email','bio','pictureURL','createdAt', 'roleId'],
        include: [{model: db.Role, attributes: ['roleName', 'updatePost', 'deletePost', 'updateComment', 'deleteComment', 'updateUser', 'deleteUser'],raw: true}]
    })
    .then(User => {
      if (User.id!=req.params.id) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      else {
        res.status(200).json(User);
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.updateProfile = (req, res, next) => {
    console.log("entrée dans le controlleur");
    console.log(res.locals.roleID);
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0]; 
    if (decodedUserId != req.params.id && res.locals.roleID > 1) {
        db.Role.findOne({where: { id: res.locals.roleID }})
        .then(Role => {
            if(Role.updateUser == 1){
                if(req.file != null){
                    console.log("file présent");
                    db.User.findOne({
                        where :{ id: req.params.id },
                        attributes: ['pictureURL']
                    }).then(User => {
                        if(User.pictureURL != null) {
                            const filename = User.pictureUrl.split('/images/')[1];
                            fs.unlink(`images/${filename}`, (err) => {
                                if (err) throw err;
                            });
                        }
                    })
                    .catch(error => res.status(501).json({ error }));
                    return db.User.update(
                        {username: req.body.username,
                            name: req.body.name,
                            surname: req.body.surname,
                            email: req.body.email,
                            bio: req.body.bio,
                            pictureURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,},
                            {where: {id: req.params.id}})
                            .then(() => res.status(201).json({ message: 'Utilisateur modifié -1 !' }))  
                            //traitement terminé...
                            .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error}));
                } else {
                    console.log("file absent");
                    return db.User.update(
                        {username: req.body.username,
                            name: req.body.name,
                            surname: req.body.surname,
                            email: req.body.email,
                            bio: req.body.bio,
                            pictureURL: req.body.pictureURL},
                            {where: {id: req.params.id}})
                            .then(() => res.status(201).json({ message: 'Utilisateur modifié -2 !' }))  
                            //traitement terminé...
                            .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error}));
                }
            }
            else {
                throw "vous ne possédez pas assez de droits pour cette action";
            }
        })
        .catch(error => res.status(501).json({ error }));
    } else if (decodedUserId == req.params.id) {
        if(req.file != null){
            console.log("file présent");
            db.User.findOne({
                where :{ id: req.params.id },
                attributes: ['pictureURL']
            }).then(User => {
                if(User.pictureURL != null) {
                    const filename = User.pictureUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) throw err;
                    });
                }
            })
            .catch(error => res.status(501).json({ error }));
            return db.User.update(
                {username: req.body.username,
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    bio: req.body.bio,
                    pictureURL: req.body.pictureURL},
                {where: {id: req.params.id}}
            ).then(() => res.status(201).json({ message: 'Utilisateur modifié -3 !' }))  
            //traitement terminé...
            .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error}));
        } else {
            console.log("file absent");
            return db.User.update(
                {username: req.body.username,
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    bio: req.body.bio,
                    pictureURL: req.body.pictureURL},
                    {where: {id: req.params.id}})
                    .then(() => res.status(201).json({ message: 'Utilisateur modifié -4 !' }))  
                    //traitement terminé...
                    .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error}));
        }
    } else {
        throw "vous ne possédez pas assez de droits pour cette action";
    }
};

exports.deleteProfile = (req, res, next) => {            
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];                    
    console.log(res.locals.roleID);
    if (res.locals.roleID > 1) {
        db.Role.findOne({where: { id: res.locals.roleID }})
        .then(Role => {
            if(Role.deleteUser == 1){
                return db.User.destroy({where: {id: req.params.id}})
                .then(res.status(201).json({ message: 'Utilisateur supprimé !' }))  
                //traitement terminé...
                .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
            }
            else {
                throw "vous ne possédez pas assez de droits pour cette action";
            }
        })
        .catch(error => res.status(501).json({ error }));
    } else if (decodedUserId == req.params.id) {
        return db.User.destroy({where: {id: req.params.id}})
        .then(res.status(201).json({ message: 'Utilisateur supprimé !' }))  
        //traitement terminé...
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    }
    else {
        throw "vous ne possédez pas assez de droits pour cette action";
    }
};

exports.giveRights = (req, res, next) => {                              
    console.log(res.locals.roleID);
    if (req.body.id != req.params.id && res.locals.roleID > 1) {
        if (req.body.roleId <= res.locals.roleID) {
            return db.User.update(
                {roleId: req.body.roleId},
                {where: {id: req.params.id}})
            .then(() => res.status(201).json({ message: 'Utilisateur modifié !' }))  
            //traitement terminé...
            .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error}));
        }
        else {
            throw "Vous ne pouvez pas donner plus de droits que vous n'en avez";
        }
    }
    else {
        throw "Vous ne pouvez pas modifier ces droits";
    }
};

exports.getAllRoles = (req, res, next) => {
    db.Role.findAll().then(roles => {
        //on récupère ici un tableau "roles" contenant tous les roles existants
        res.status(200).json(roles);
    }).catch(function (e) {
        //gestion erreur
        res.status(400).json(roles);
        console.log(e);
    })
};
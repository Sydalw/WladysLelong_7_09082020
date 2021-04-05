//on importe le modèle
var modelPost = require('../models/Post');
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

//recherche de tous les posts d'un user
exports.getAllPostsPerUser = (req, res, next) => {
    modelPost.Post.findAll({where: {userId: req.params.id}}).then(posts => {

        res.status(200).json(posts);
        console.log(posts);
    }).catch(function (e) {
        //gestion erreur
        res.status(400).json(posts);
        console.log(e);
    })
};

exports.readPost = (req, res, next) => {
    modelPost.Post.findOne({where :{ postId: req.params.postId }})
    .then(Post => {
      if (Post.postId!=req.params.postId) {
        return res.status(401).json({ error: 'Post non trouvé !' });
      }
      else {
        res.status(200).json(Post);
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.createPost = (req, res, next) => {
    modelPost.Post.create({
        userId: req.body.id,
        title: req.body.title,
        content: req.body.content,
        pictureURL: req.body.pictureURL,
        creationDate: fullDate,
        updateDate: fullDate
    })
    .then(res.status(201).json({ message: 'Post créé !' }))          
    .catch(res.status(401).json({ message: 'Post non créé !' }));
};

exports.updatePost = (req, res, next) => {                               //TODO Il y a une erreur dans la console mais la route fonctionne
    try {
        console.log(res.locals.roleID);
            modelPost.Post.update({   
                title: req.body.title,
                content: req.body.content,
                pictureURL: req.body.pictureURL,
                updateDate: fullDate},
                {where: {postId: req.params.postId}})
            .then(res.status(201).json({ message: 'Post modifié !' }))  
            //traitement terminé...
            .catch(res.status(401).json({ message: 'Une erreur est apparue !' }));
        }
    catch {
        return res.status(401).json({ error: 'Post non trouvé !' });
    }
};

exports.deletePost = (req, res, next) => {                               //TODO Il y a une erreur dans la console mais la route fonctionne
    try {
        console.log(res.locals.roleID);
        modelPost.Post.destroy(
            {where: {postId: req.params.postId}}
        ).then(res.status(201).json({ message: 'Post supprimé !' }))  
        //traitement terminé...
        .catch(res.status(401).json({ message: 'Une erreur est apparue !' }));
        }
    catch {
        return res.status(401).json({ error: 'Post non trouvé !' });
    }
};
//on importe le modèle
var modelComment = require('../models/Comment');
var modelLiking = require('../models/Liking');
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

//recherche de tous les comments d'un user
exports.getAllCommentsPerUser = (req, res, next) => {
    modelComment.Comment.findAll({where: {userId: req.params.id}}).then(comments => {

        res.status(200).json(comments);
        console.log(comments);
    }).catch(function (e) {
        //gestion erreur
        res.status(400).json(comments);
        console.log(e);
    })
};

//recherche de tous les comments d'un post
exports.getAllCommentsPerPost = (req, res, next) => {
    modelComment.Comment.findAll({where: {postId: req.params.postId}}).then(comments => {

        res.status(200).json(comments);
        console.log(comments);
    }).catch(function (e) {
        //gestion erreur
        res.status(400).json(comments);
        console.log(e);
    })
};

exports.readComment = (req, res, next) => {
    modelComment.Comment.findOne({where :{ commentId: req.params.commentId }})
    .then(Comment => {
      if (Comment.commentId!=req.params.commentId) {
        return res.status(401).json({ error: 'Commentaire non trouvé !' });
      }
      else {
        res.status(200).json(Comment);
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.createComment = (req, res, next) => {
    modelComment.Comment.create({
        postId: req.body.postId,
        userId: req.body.id,
        relatedComment: req.body.relatedComment,
        content: req.body.content,
        creationDate: fullDate,
        updateDate: fullDate
    })
    .then(res.status(201).json({ message: 'Commentaire créé !' }))          
    .catch(res.status(401).json({ message: 'Commentaire non créé !' }));
};

exports.updateComment = (req, res, next) => {                               //TODO Il y a une erreur dans la console mais la route fonctionne
    try {
        console.log(res.locals.roleID);
            modelComment.Comment.update({   
                content: req.body.content,
                updateDate: fullDate},
                {where: {commentId: req.params.commentId}})
            .then(res.status(201).json({ message: 'Commentaire modifié !' }))  
            //traitement terminé...
            .catch(res.status(401).json({ message: 'Une erreur est apparue !' }));
        }
    catch {
        return res.status(401).json({ error: 'Commentaire non trouvé !' });
    }
};

exports.deleteComment = (req, res, next) => {                               //TODO Il y a une erreur dans la console mais la route fonctionne
    try {
        console.log(res.locals.roleID);
        modelComment.Comment.destroy(
            {where: {commentId: req.params.commentId}}
        ).then(res.status(201).json({ message: 'Commentaire supprimé !' }))  
        //traitement terminé...
        .catch(res.status(401).json({ message: 'Une erreur est apparue !' }));
        }
    catch {
        return res.status(401).json({ error: 'Commentaire non trouvé !' });
    }
};

exports.likeComment = (req, res, next) => {

    modelLiking.Liking.findOne({where: {commentId: req.body.commentId }})
        .then(Liking => {
            switch (Liking) {
                case 1:
                   
                    break;
                case 0:
                   
                    break;
                case -1:
                    
            }
           
        })
        .catch(error => res.status(500).json({ error }));
};

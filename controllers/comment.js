//on importe le modèle
var modelComment = require('../models/Comment');
var modelPost = require('../models/Post');
var modelLiking = require('../models/Liking');
var modelRole = require('../models/Role');
const config = require('dotenv').config();
const jwt = require('jsonwebtoken');
const keyValueToken = process.env.key_value_token;
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

modelPost.Post.hasMany(modelComment.Comment, {foreignKey: 'fk_postId_from_comments', as: 'Coco'});
modelComment.Comment.belongsTo(modelPost.Post, {foreignKey: 'fk_postId_from_comments', as: 'Coco'});

//recherche de tous les comments d'un user
exports.getAllCommentsPerUser = (req, res, next) => {
    modelComment.Comment.findAll({where: {userId: req.params.id}}).then(comments => {
        res.status(200).json(comments);
    }).catch(function (e) {
        //gestion erreur
        res.status(400).json(comments);
        console.log(e);
    })
};

//recherche de tous les comments d'un post
exports.getAllCommentsPerPost = (req, res, next) => {
    modelPost.Post.findOne({attributes: ['title', 'content', 'pictureURL', 'creationDate', 'updateDate'], include: [{model: modelComment.Comment, as:'Coco', required: true, attributes: {exclude: ['postId']}}]})
    //modelComment.Comment.findAll({where: {postId: req.params.postId}, include: [{model: modelLiking.Liking, required: true, attributes:})
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(function (e) {
        //gestion erreur
        console.log(e);
        res.status(400).json(posts);
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
    var dayDate = new Date();

    return modelComment.Comment.create({
        postId: req.params.postId,
        userId: req.body.id,
        relatedComment: req.body.relatedComment,
        content: req.body.content,
        creationDate: dayDate,
        updateDate: dayDate,
        deletionFlag: 0
    })
    .then(() => res.status(201).json({ message: 'Commentaire créé !' }))          
    .catch((error) => res.status(401).json({ message: 'Commentaire non créé !', error }));
};

exports.updateComment = (req, res, next) => {        
    var dayDate = new Date();
    
    function fctUpdateComment(){
        return modelComment.Comment.findOne({where :{ commentId: req.params.commentId }})
        .then(Comment => {
            if (Comment.deletionFlag != true){
                modelComment.Comment.update({   
                    content: req.body.content,
                    updateDate: dayDate},
                    {where: {commentId: req.params.commentId}})
                .then(() => res.status(201).json({ message: 'Commentaire modifié !' }))  
                //traitement terminé...
                .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
            }
            else {
                throw "Commentaire supprimé : modification impossible";
            }
        })
        .catch(error => res.status(501).json({ error : 'Commentaire non trouvé !', error })); 
    }

    console.log(res.locals.roleID);
    console.log(req.params.commentId);
    console.log(req.params.id);

    modelComment.Comment.sequelize.query("SELECT commentId, userId, Users.username, content, Comments.creationDate, Comments.updateDate, Users.roleId, Roles.updateComment FROM Comments INNER JOIN (Users INNER JOIN Roles ON Users.roleId=Roles.roleId) ON userId=id WHERE commentId="+req.params.commentId)
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.updateComment == 1){                                                                    //Si l'utilisateur a un role qui autorise la modif de commentaire
                fctUpdateComment();
                console.log("boucle 1");
            }
            else {
                throw "vous ne possédez pas assez de droits pour cette action";
            }
        }
        else if (req.body.id == result.userId) {                                                              //
            fctUpdateComment();
            console.log("boucle 2");
        }
        else {
        throw "vous ne possédez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.deleteComment = (req, res, next) => {
    var dayDate = new Date();

    function fctDeleteComment() {
        return modelComment.Comment.update({   
            content: "Commentaire supprimé",
            updateDate: dayDate,
            deletionFlag: true},
            {where: {commentId: req.params.commentId}})
        .then(() => res.status(201).json({ message: 'Commentaire supprimé !' }))  
        //traitement terminé...
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    }

    console.log(res.locals.roleID);
    modelComment.Comment.sequelize.query("SELECT commentId, userId, Users.username, content, Comments.creationDate, Comments.deleteDate, Users.roleId, Roles.updateComment FROM Comments INNER JOIN (Users INNER JOIN Roles ON Users.roleId=Roles.roleId) ON userId=id WHERE commentId="+req.params.commentId)
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.updateComment == 1){                                                                    //Si l'utilisateur a un role qui autorise la modif de commentaire
                fctDeleteComment();
                console.log("boucle 1");
            }
            else {
                throw "vous ne possédez pas assez de droits pour cette action";
            }
        }
        else if (req.body.id == result.userId) {                                                              //
            fctDeleteComment();
            console.log("boucle 2");
        }
        else {
        throw "vous ne possédez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.likeComment = (req, res, next) => {
    const likingInput = req.body.liking;
        switch (likingInput) {
            case 1:
                modelLiking.Liking.create({
                    commentId: req.params.commentId,
                    userId: req.body.id,
                    liking: true,
                    disliking: false
                })
                .then(res.status(201).json({ message: 'Like enregistré !' }))          
                .catch(res.status(401).json({ message: 'Like non enregistré !' }));
                break;
            case 0:
                modelLiking.Liking.destroy(
                    {where: {commentId: req.params.commentId, userId: req.body.id}}
                ).then(res.status(201).json({ message: 'Annulation enregistrée !' }))  
                //traitement terminé...
                .catch(res.status(401).json({ message: 'Une erreur est apparue !' }));
                break;
            case -1:
                modelLiking.Liking.create({
                    commentId: req.params.commentId,
                    userId: req.body.id,
                    disliking: true,
                    liking: false
                })
                .then(res.status(201).json({ message: 'Dislike enregistré !' }))          
                .catch(res.status(401).json({ message: 'Dislike non enregistré !' }));
        }
};

exports.getLikingsForAComment= (req, res, next) => {

    modelRole.Role.sequelize.query("SELECT SUM(liking) as Likes, SUM(disliking) as Dislikes FROM Likings WHERE commentId="+req.params.commentId)
    .then(([results, metadata]) => {
        res.status(201).json(results)
      })
    .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    
};
const config = require('dotenv').config();
const jwt = require('jsonwebtoken');
const keyValueToken = process.env.key_value_token;
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

var sequelize = require('sequelize');
var db = require('../lib/models/index.js');

//recherche de tous les comments d'un user
exports.getAllCommentsPerUser = (req, res, next) => {                                       //TODO il faut ajouter le compte des likes/dislikes
    db.Comment.findAll({where: {userId: req.params.id}, include: [{model: db.Liking, attributes: [sequelize.fn('SUM', sequelize.col('liking')), sequelize.fn('SUM', sequelize.col('disliking'))],raw: true}]}).then(comments => {
    res.status(200).json(comments);
    }).catch(function (e) {
        //gestion erreur
        res.status(400).json(comments);
        console.log(e);
    })
};

//recherche de tous les comments d'un post
exports.getAllCommentsPerPost = (req, res, next) => {
    //db.Post.findOne({attributes: ['title', 'content', 'pictureURL', 'createdAt', 'updatedAt'], include: [{model: db.Comment, required: true, attributes: {exclude: ['postId']}}]})
    db.sequelize.query("SELECT Comments.id, Users.username, Comments.postId, Comments.relatedComment, Comments.content, Comments.createdAt, Comments.updatedAt, SUM(Likings.liking), SUM(Likings.disliking) FROM Posts INNER JOIN Comments ON Comments.postId=Posts.id INNER JOIN Users ON Posts.userId=Users.id LEFT JOIN Likings ON Comments.id=Likings.commentId WHERE Comments.postId="+req.params.postId+" GROUP BY Comments.id;", {raw:true, type: sequelize.QueryTypes.SELECT})
    .then(comments => {
        comments.forEach(element => console.log(element.id));
        res.status(200).json(comments);
    })
    .catch(function (e) {
        //gestion erreur
        console.log(e);
        res.status(400).json(comments);
    })
};

exports.readComment = (req, res, next) => {
    db.Comment.findOne({where :{ id: req.params.commentId }})
    .then(Comment => {
      if (Comment.id!=req.params.commentId) {
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

    return db.Comment.create({
        postId: req.params.postId,
        userId: req.body.id,
        relatedComment: req.body.relatedComment,
        content: req.body.content,
        createdAt: dayDate,
        updatedAt: dayDate,
        deletionFlag: 0
    })
    .then(() => res.status(201).json({ message: 'Commentaire créé !' }))          
    .catch((error) => res.status(401).json({ message: 'Commentaire non créé !', error }));
};

exports.updateComment = (req, res, next) => {        
    var dayDate = new Date();
    
    function fctUpdateComment(){
        return db.Comment.findOne({where :{ id: req.params.commentId }})
        .then(Comment => {
            if (Comment.deletionFlag != true){
                db.Comment.update({   
                    content: req.body.content,
                    updatedAt: dayDate},
                    {where: {id: req.params.commentId}})
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

    db.User.findOne({attributes: ['id', 'roleId'], where: {id: req.body.id}, include: { model: db.Role, attributes: ['updateComment']}})  
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.Role.updateComment == 1){                                                                    //Si l'utilisateur a un role qui autorise la modif de commentaire
                fctUpdateComment();
            }
            else {
                throw "1 - vous ne possédez pas assez de droits pour cette action";
            }
        }
        else if (req.body.id == result.id) {                                                              
            fctUpdateComment();
        }
        else {
            throw "2 - vous ne possédez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.deleteComment = (req, res, next) => {
    var dayDate = new Date();

    function fctDeleteComment() {
        return db.Comment.update({   
            content: "Commentaire supprimé",
            updatedAt: dayDate,
            deletionFlag: true},
            {where: {id: req.params.commentId}})
        .then(() => res.status(201).json({ message: 'Commentaire supprimé !' }))  
        //traitement terminé...
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    }

    db.User.findOne({attributes: ['id', 'roleId'], where: {id: req.body.id}, include: { model: db.Role, attributes: ['deleteComment']}})  
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.Role.deleteComment == 1){                                                                    //Si l'utilisateur a un role qui autorise la modif de commentaire
                fctDeleteComment();
            }
            else {
                throw "1 - vous ne possédez pas assez de droits pour cette action";
            }
        }
        else if (req.body.id == result.id) {                                                              
            fctDeleteComment();
        }
        else {
        throw "2 - vous ne possédez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.likeComment = (req, res, next) => {                                                 //TODO il faut empecher le like d'un commentaire supprimé
    const likingInput = req.body.liking;
        switch (likingInput) {
            case 1:
                db.Liking.create({
                    commentId: req.params.commentId,
                    userId: req.body.id,
                    liking: true,
                    disliking: false
                })
                .then(res.status(201).json({ message: 'Like enregistré !' }))          
                .catch(res.status(401).json({ message: 'Like non enregistré !' }));
                break;
            case 0:
                db.Liking.destroy(
                    {where: {commentId: req.params.commentId, userId: req.body.id}}
                ).then(res.status(201).json({ message: 'Annulation enregistrée !' }))  
                //traitement terminé...
                .catch(res.status(401).json({ message: 'Une erreur est apparue !' }));
                break;
            case -1:
                db.Liking.create({
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

    db.Role.sequelize.query("SELECT SUM(liking) as Likes, SUM(disliking) as Dislikes FROM Likings WHERE commentId="+req.params.commentId)
    .then(([results, metadata]) => {
        res.status(201).json(results)
      })
    .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    
};
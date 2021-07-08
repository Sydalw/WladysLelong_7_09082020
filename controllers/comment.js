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
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];  
    db.sequelize.query("SELECT Comments.id AS commentId,Users.id, Users.username, Users.pictureURL AS profilePictureURL, Comments.postId, Comments.relatedComment, Comments.deletionFlag,Comments.indentationLevel, Comments.content, Comments.createdAt, Comments.updatedAt,SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT Likings.liking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.commentId=Comments.id) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.commentId=Comments.id) AS myDislike, (SELECT COUNT(C3.id) FROM (SELECT C2.id, C2.postId, C2.userId, C2.relatedComment, C2.content, C2.deletionFlag, C2.indentationLevel, C2.createdAt, C2.updatedAt, C1.id AS C1_id, C1.relatedComment AS C1_rC, C1.content AS C1_c FROM Comments As C1 RIGHT OUTER JOIN Comments AS C2 ON C2.id=C1.relatedComment WHERE C2.postId= :requestedId AND C2.indentationLevel=0 AND C2.id=C1.relatedComment AND C2.id=Comments.id) AS C3) AS CommentsNb FROM Comments INNER JOIN Users ON Comments.userId=Users.id LEFT JOIN Likings ON Comments.id=Likings.commentId WHERE Comments.postId= :requestedId AND Comments.indentationLevel=0 GROUP BY Comments.id;", {raw:true, replacements:{decodedUserId: decodedUserId, requestedId: req.params.postId}, type: sequelize.QueryTypes.SELECT})
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

//recherche de tous les comments d'un commentaire
exports.getAllCommentsPerComment = (req, res, next) => {
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];  
    db.sequelize.query("SELECT Comments.id AS commentId,Users.id, Users.username, Users.pictureURL AS profilePictureURL, Comments.postId, Comments.relatedComment, Comments.deletionFlag,Comments.indentationLevel, Comments.content, Comments.createdAt, Comments.updatedAt,SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT Likings.liking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.commentId=Comments.id) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.commentId=Comments.id) AS myDislike, (SELECT COUNT(C3.id) FROM (SELECT C2.id, C2.postId, C2.userId, C2.relatedComment, C2.content, C2.deletionFlag, C2.indentationLevel, C2.createdAt, C2.updatedAt, C1.id AS C1_id, C1.relatedComment AS C1_rC, C1.content AS C1_c FROM Comments As C1 RIGHT OUTER JOIN Comments AS C2 ON C2.id=C1.relatedComment WHERE C2.id=commentId AND C2.id=C1.relatedComment) AS C3) AS CommentsNb FROM Comments INNER JOIN Users ON Comments.userId=Users.id LEFT JOIN Likings ON Comments.id=Likings.commentId WHERE Comments.relatedComment= :requestedId GROUP BY Comments.id;", {raw:true, replacements:{decodedUserId: decodedUserId, requestedId: req.params.commentId}, type: sequelize.QueryTypes.SELECT})
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
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];  
    db.sequelize.query("SELECT Comments.id, Comments.userId, Comments.content, Comments.createdAt, Users.pictureURL AS profilePictureURL, Users.username, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT Likings.liking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.commentId= :requestedId) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.commentId= :requestedId) AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.relatedComment = Comments.id) AS CommentsNb FROM Comments LEFT JOIN Likings ON Comments.id=Likings.commentId INNER JOIN Users ON Users.id=Comments.userId WHERE Comments.id= :requestedId GROUP BY Comments.id;", {raw:true, replacements:{decodedUserId: decodedUserId, requestedId: req.params.commentId}, type: sequelize.QueryTypes.SELECT})
    //db.Post.findOne({where :{ id: req.params.postId }})
    .then(Post => {
        res.status(200).json(Post);

    })
    .catch(error => res.status(501).json({ error }));
};

exports.createComment = (req, res, next) => {
    var dayDate = new Date();
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];  
    if (req.body.relatedComment === null || req.body.relatedComment === 0 ) {
        return db.Comment.create({
            postId: req.params.postId,
            userId: decodedUserId,
            relatedComment: req.body.relatedComment,
            content: req.body.content,
            createdAt: dayDate,
            updatedAt: dayDate,
            deletionFlag: 0,
            indentationLevel: 0
        })
        .then(() => res.status(201).json({ message: 'Commentaire créé !' }))          
        .catch((error) => res.status(401).json({ message: 'Commentaire non créé !', error }));
    } else {
        return db.Comment.findOne({where :{ id: req.body.relatedComment}})
        .then(returnedComment => {
            var indentation = returnedComment.indentationLevel + 1;
            console.log("indentation : "+indentation);
            console.log(req.params.postId);
            console.log(decodedUserId);
            console.log(req.body.relatedComment);
            console.log(req.body.content);
            return db.Comment.create({
                postId: req.params.postId,
                userId: decodedUserId,
                relatedComment: req.body.relatedComment,
                content: req.body.content,
                createdAt: dayDate,
                updatedAt: dayDate,
                deletionFlag: 0,
                indentationLevel: indentation
            })
            .then(() => res.status(201).json({ message: 'Commentaire créé !' }))          
            .catch((error) => res.status(402).json({ message: 'Commentaire non créé !', error }));
        })
        .catch(error => res.status(501).json({ error : 'Commentaire non trouvé !', error })); 
    }
};

exports.updateComment = (req, res, next) => {        
    var dayDate = new Date();
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];  

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

    db.User.findOne({attributes: ['id', 'roleId'], where: {id: decodedUserId}, include: { model: db.Role, attributes: ['updateComment']}})  
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.Role.updateComment == 1){                                                                    //Si l'utilisateur a un role qui autorise la modif de commentaire
                fctUpdateComment();
            }
            else {
                throw "1 - vous ne possédez pas assez de droits pour cette action";
            }
        }
        else if (decodedUserId == result.id) {                                                              
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
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];  

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

    db.User.findOne({attributes: ['id', 'roleId'], where: {id: decodedUserId}, include: { model: db.Role, attributes: ['deleteComment']}})  
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.Role.deleteComment == 1){                                                                    //Si l'utilisateur a un role qui autorise la modif de commentaire
                fctDeleteComment();
            }
            else {
                throw "1 - vous ne possédez pas assez de droits pour cette action";
            }
        }
        else if (decodedUserId == result.id) {                                                              
            fctDeleteComment();
        }
        else {
        throw "2 - vous ne possédez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.likeComment = (req, res, next) => {
    const likingInput = req.body.liking;
    let userLike = 0
    let userDislike = 0;
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];  

    db.Liking.findOne({attributes: ['id', 'postId', 'commentId', 'userId', 'Liking', 'Disliking'], where: {userId: decodedUserId, commentId: req.params.commentId}})
    .then(result => {
        userLike = result.dataValues.Liking;
        userDislike = result.dataValues.Disliking;
        console.log("A Like : "+userLike+" / Dislike : "+userDislike);
        return db.Liking.destroy(
            {where: {commentId: req.params.commentId, userId: decodedUserId}})
        .then(() => res.status(201).json({ message: 'Annulation enregistrée !' }))  
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    })
    .catch(function(error) {
        switch (likingInput) {
            case 1:
                if(userLike === 0 && userDislike === 0) {
                    console.log("B Like : "+userLike+" / Dislike : "+userDislike);
                    return db.Liking.create({
                        commentId: req.params.commentId,
                        userId: decodedUserId,
                        liking: true,
                        disliking: false
                    })
                    .then(() => res.status(201).json({ message: 'Like enregistré !' }))          
                    .catch((error) => res.status(401).json({ message: 'Like non enregistré !', error }));
                    break;
                } else {
                    throw "Vous avez déjà liké ce message"
                }
            case 0:
                res.status(501).json({ message: 'Aucun like à annuler !', error });
                break;
            case -1:
                if(userLike === 0 && userDislike === 0){
                    console.log("B Like : "+userLike+" / Dislike : "+userDislike);
                    return db.Liking.create({
                        commentId: req.params.commentId,
                        userId: decodedUserId,
                        disliking: true,
                        liking: false
                    })
                    .then(() => res.status(201).json({ message: 'Dislike enregistré !' }))          
                    .catch((error) => res.status(401).json({ message: 'Dislike non enregistré !', error }));
                } else {
                    throw "Vous avez déjà disliké ce message"
                }
        }
        }
    );
};
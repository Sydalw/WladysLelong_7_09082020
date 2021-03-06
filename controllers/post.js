const config = require('dotenv').config();
const jwt = require('jsonwebtoken');
const keyValueToken = process.env.key_value_token;
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

var sequelize = require('sequelize');
var db = require('../lib/models/index.js');

//recherche de tous les posts d'un user
exports.getAllPostsPerUser = (req, res, next) => {        
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];                              //TODO Comment faire via ORM ?? 
    db.sequelize.query("SELECT Users.id, Users.username, Users.pictureURL AS profilePictureURL, Posts.id AS postId, Posts.title, Posts.content, Posts.pictureURL, Posts.createdAt, Posts.updatedAt, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT Likings.liking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId=Posts.id) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId=Posts.id) AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.postId=Posts.id AND Comments.indentationLevel = 0) AS CommentsNb FROM Users INNER JOIN Posts ON Users.id=Posts.userId LEFT JOIN Likings ON Posts.id=Likings.postId WHERE Users.id= :requestedId GROUP BY Posts.id;", {raw:true, replacements:{decodedUserId: decodedUserId, requestedId: req.params.userId}, type: sequelize.QueryTypes.SELECT})
    .then(posts => {
        posts.forEach(element => console.log(element.id));
        res.status(200).json(posts);
    })
    .catch(function (e) {
        //gestion erreur
        res.status(400).json(posts);
        console.log(e);
    })
};

//recherche de tous les posts d'un user
exports.getLastPosts = (req, res, next) => {
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];                                        //TODO Comment faire via ORM ?? 
    db.sequelize.query("SELECT Posts.id AS postId, Posts.title, Posts.content, Posts.pictureURL, Posts.createdAt, Posts.updatedAt, Users.id, Users.username, Users.pictureURL, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, SUM(Likings.liking) AS Likes, (SELECT Likings.liking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId=Posts.id) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId=Posts.id) AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.postId=Posts.id AND Comments.indentationLevel = 0) AS CommentsNb FROM Posts INNER JOIN Users ON Users.id=Posts.userId LEFT JOIN Likings ON Posts.id=Likings.postId GROUP BY Posts.id ORDER BY Posts.createdAt DESC;", {raw:true, replacements:{decodedUserId: decodedUserId}, type: sequelize.QueryTypes.SELECT})
    .then(posts => {
        posts.forEach(element => console.log(element.id));
        res.status(200).json(posts);
    })
    .catch(function (e) {
        //gestion erreur
        res.status(400).json(posts);
        console.log(e);
    })
};

//recherche de tous les posts d'un user
exports.getNbLastPosts = (req, res, next) => {
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];                                        //TODO Comment faire via ORM ?? 
    db.sequelize.query("SELECT COUNT(postId) AS Nb FROM (SELECT Posts.id AS postId, Posts.title, Posts.content, Posts.pictureURL, Posts.createdAt, Posts.updatedAt, Users.id, Users.username, SUM(Likings.disliking) AS Dislikes, SUM(Likings.liking) AS Likes, (SELECT Likings.liking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId=Posts.id) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId=Posts.id) AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.postId=Posts.id AND Comments.indentationLevel = 0) AS CommentsNb FROM Posts INNER JOIN Users ON Users.id=Posts.userId LEFT JOIN Likings ON Posts.id=Likings.postId GROUP BY Posts.id ORDER BY Posts.createdAt DESC) AS Datas", {raw:true, replacements:{decodedUserId: decodedUserId}, type: sequelize.QueryTypes.SELECT})
    .then(numberOfPosts => {
        res.status(200).json(numberOfPosts);
    })
    .catch(function (e) {
        //gestion erreur
        res.status(400).json(numberOfPosts);
        console.log(e);
    })
};

//recherche de tous les posts d'un user
exports.getPopularPosts = (req, res, next) => {
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];                                        //TODO Comment faire via ORM ?? 
    db.sequelize.query("SELECT Posts.id AS postId, Posts.title, Posts.content, Posts.pictureURL, Posts.createdAt, Posts.updatedAt, Users.id, Users.username, Users.pictureURL, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, SUM(Likings.liking) AS Likes, (SELECT Likings.liking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId=Posts.id) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId=Posts.id) AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.postId=Posts.id AND Comments.indentationLevel = 0) AS CommentsNb FROM Posts INNER JOIN Users ON Users.id=Posts.userId LEFT JOIN Likings ON Posts.id=Likings.postId GROUP BY Posts.id ORDER BY CommentsNb DESC;", {raw:true, replacements:{decodedUserId: decodedUserId}, type: sequelize.QueryTypes.SELECT})
    .then(posts => {
        posts.forEach(element => console.log(element.id));
        res.status(200).json(posts);
    })
    .catch(function (e) {
        //gestion erreur
        res.status(400).json(posts);
        console.log(e);
    })
};

exports.readPost = (req, res, next) => {
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];  
    db.sequelize.query("SELECT Posts.id, Posts.userId, Posts.title, Posts.content, Posts.createdAt, Users.pictureURL AS profilePictureURL, Users.username, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT Likings.liking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId= :requestedId) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId= :decodedUserId AND Likings.postId= :requestedId) AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.postId = Posts.id AND Comments.indentationLevel = 0) AS CommentsNb FROM Posts LEFT JOIN Likings ON Posts.id=Likings.postId INNER JOIN Users ON Users.id=Posts.userId WHERE Posts.id= :requestedId GROUP BY Posts.id;", {raw:true, replacements:{decodedUserId: decodedUserId, requestedId: req.params.postId}, type: sequelize.QueryTypes.SELECT})
    //db.Post.findOne({where :{ id: req.params.postId }})
    .then(Post => {
        res.status(200).json(Post);

    })
    .catch(error => res.status(501).json({ error }));
};

exports.createPost = (req, res, next) => {
    var dayDate = new Date();

    return db.Post.create({
        userId: req.body.id,
        title: req.body.title,
        content: req.body.content,
        pictureURL: req.body.pictureURL,
        createdAt: dayDate,
        updatedAt: dayDate
    })
    .then(() => res.status(201).json({ message: 'Post cr???? !' }))          
    .catch((error) => res.status(401).json({ message: 'Post non cr???? !', error }));
};

exports.updatePost = (req, res, next) => {
    var dayDate = new Date();

    function fctUpdatePost(){
        return db.Post.update({   
            title: req.body.title,
            content: req.body.content,
            //pictureURL: req.body.pictureURL,
            updatedAt: dayDate},
            {where: {id: req.params.postId}})
        .then(() => res.status(201).json({ message: 'Post modifi?? !' }))  
        //traitement termin??...
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    }

    db.User.findOne({attributes: ['id', 'roleId'], where: {id: req.body.id}, include: { model: db.Role, attributes: ['updatePost']}})     
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.Role.updatePost == 1){
                fctUpdatePost();
            }
            else {
                throw "1 - vous ne poss??dez pas assez de droits pour cette action";
            }
        } else if (req.body.id == result.id) {
            fctUpdatePost();
        }
        else {
            throw "2 - vous ne poss??dez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(502).json({ error }));
};

exports.deletePost = (req, res, next) => {
    var dayDate = new Date();
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];

    function fctDeletePost() {
        return db.Post.destroy(
            {where: {id: req.params.postId}})
        .then(() => res.status(201).json({ message: 'Post supprim?? !' })) 
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    }

    console.log(res.locals.roleID);
    db.User.findOne({attributes: ['id', 'roleId'], where: {id: decodedUserId}, include: { model: db.Role, attributes: ['deletePost']}})    
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.Role.deletePost == 1){
                fctDeletePost();
            }
            else {
                throw "1 - vous ne poss??dez pas assez de droits pour cette action";
            }
        } else if (decodedUserId == result.id) {
            fctDeletePost();
        }
        else {
            throw "2 - vous ne poss??dez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(501).json({ error })); 
};

exports.likePost = (req, res, next) => {
    const likingInput = req.body.liking;
    let userLike = 0
    let userDislike = 0;
    const decodedUserId = (req.headers.authorization.split(' ')[1]).split(':')[0];  
    db.Liking.findOne({attributes: ['id', 'postId', 'commentId', 'userId', 'Liking', 'Disliking'], where: {userId: decodedUserId, postId: req.params.postId, commentId: null}})
    .then(result => {
        userLike = result.dataValues.Liking;
        userDislike = result.dataValues.Disliking;
        console.log("A Like : "+userLike+" / Dislike : "+userDislike);
        return db.Liking.destroy(
            {where: {postId: req.params.postId, userId: decodedUserId}})
        .then(() => res.status(201).json({ message: 'Annulation enregistr??e !' }))  
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    })
    .catch(function(error) {
        switch (likingInput) {
            case 1:
                if(userLike === 0 && userDislike === 0) {
                    console.log("B Like : "+userLike+" / Dislike : "+userDislike);
                    return db.Liking.create({
                        postId: req.params.postId,
                        userId: decodedUserId,
                        liking: true,
                        disliking: false
                    })
                    .then(() => res.status(201).json({ message: 'Like enregistr?? !' }))          
                    .catch((error) => res.status(401).json({ message: 'Like non enregistr?? !', error }));
                    break;
                } else {
                    throw "Vous avez d??j?? lik?? ce message"
                }
            case 0:
                res.status(501).json({ message: 'Aucun like ?? annuler !', error });
                break;
            case -1:
                if(userLike === 0 && userDislike === 0){
                    console.log("B Like : "+userLike+" / Dislike : "+userDislike);
                    return db.Liking.create({
                        postId: req.params.postId,
                        userId: decodedUserId,
                        disliking: true,
                        liking: false
                    })
                    .then(() => res.status(201).json({ message: 'Dislike enregistr?? !' }))          
                    .catch((error) => res.status(401).json({ message: 'Dislike non enregistr?? !', error }));
                } else {
                    throw "Vous avez d??j?? dislik?? ce message"
                }
        }
        }
    );
};
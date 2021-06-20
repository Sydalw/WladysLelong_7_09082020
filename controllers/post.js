const config = require('dotenv').config();
const jwt = require('jsonwebtoken');
const keyValueToken = process.env.key_value_token;
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

var sequelize = require('sequelize');
var db = require('../lib/models/index.js');

//recherche de tous les posts d'un user
exports.getAllPostsPerUser = (req, res, next) => {                                      //TODO Comment faire via ORM ?? 
    db.sequelize.query("SELECT Users.id, Users.username, Users.pictureURL AS profilePictureURL, Posts.id AS postId, Posts.title, Posts.content, Posts.pictureURL, Posts.createdAt, Posts.updatedAt, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT Likings.liking FROM Likings WHERE Likings.userId="+req.body.id+" AND Likings.postId=Posts.id) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId="+req.body.id+" AND Likings.postId=Posts.id) AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.postId=Posts.id) AS CommentsNb FROM Users INNER JOIN Posts ON Users.id=Posts.userId LEFT JOIN Likings ON Posts.id=Likings.postId WHERE Users.id="+req.params.userId+" GROUP BY Posts.id;", {raw:true, type: sequelize.QueryTypes.SELECT})
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

// exports.getAllPostsPerUser = (req, res, next) => {          
//     db.Post.findAll({attributes: ['postId', 'title', 'content', 'userId'], include: [{model: modelUser.User, attributes: ['username'], where: {id: req.params.userId}}]})
//     .then(posts => {
//         console.log(posts);
//         res.status(200).json(posts);})
//     .catch(function (e) {
//         //gestion erreur
//         console.log(e);
//         res.status(400).json();
//     })
// };

// exports.getAllPostsPerUser = (req, res, next) => {     
//     db.Post.sequelize.query("SELECT postId, userId, username, title, content, Posts.createdAt, Posts.updatedAt FROM Posts INNER JOIN Users ON userId=id WHERE userId="+req.params.userId)
//     .then(([results, metadata]) => {
//         res.status(201).json(results)
//     })
//     .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
// }

//recherche de tous les posts d'un user
exports.getLastPosts = (req, res, next) => {                                      //TODO Comment faire via ORM ?? 
    db.sequelize.query("SELECT Posts.id AS postId, Posts.title, Posts.content, Posts.pictureURL, Posts.createdAt, Posts.updatedAt, Users.id, Users.username, Users.pictureURL, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, SUM(Likings.liking) AS Likes, (SELECT Likings.liking FROM Likings WHERE Likings.userId="+req.body.id+" AND Likings.postId=Posts.id) AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId="+req.body.id+" AND Likings.postId=Posts.id) AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.postId=Posts.id) AS CommentsNb FROM Posts INNER JOIN Users ON Users.id=Posts.userId LEFT JOIN Likings ON Posts.id=Likings.postId GROUP BY Posts.id ORDER BY Posts.createdAt DESC;", {raw:true, type: sequelize.QueryTypes.SELECT})
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
    db.sequelize.query("SELECT Posts.id, Posts.userId, Posts.title, Posts.content, Posts.createdAt, Users.pictureURL AS profilePictureURL, Users.username, SUM(Likings.liking) AS Likes, SUM(Likings.disliking) AS Dislikes, (SELECT Likings.liking FROM Likings WHERE Likings.userId="+req.body.id+" AND Likings.postId="+req.params.postId+") AS myLike, (SELECT Likings.disliking FROM Likings WHERE Likings.userId="+req.body.id+" AND Likings.postId="+req.params.postId+") AS myDislike, (SELECT COUNT(Comments.id) FROM Comments WHERE Comments.postId = Posts.id) AS CommentsNb FROM Posts LEFT JOIN Likings ON Posts.id=Likings.postId INNER JOIN Users ON Users.id=Posts.userId WHERE Posts.id="+req.params.postId+" GROUP BY Posts.id;", {raw:true, type: sequelize.QueryTypes.SELECT})
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
    .then(() => res.status(201).json({ message: 'Post créé !' }))          
    .catch((error) => res.status(401).json({ message: 'Post non créé !', error }));
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
        .then(() => res.status(201).json({ message: 'Post modifié !' }))  
        //traitement terminé...
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    }

    db.User.findOne({attributes: ['id', 'roleId'], where: {id: req.body.id}, include: { model: db.Role, attributes: ['updatePost']}})     
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.Role.updatePost == 1){
                fctUpdatePost();
            }
            else {
                throw "1 - vous ne possédez pas assez de droits pour cette action";
            }
        } else if (req.body.id == result.id) {
            fctUpdatePost();
        }
        else {
            throw "2 - vous ne possédez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(502).json({ error }));
};

exports.deletePost = (req, res, next) => {
    var dayDate = new Date();

    function fctDeletePost() {
        return db.Post.destroy(
            {where: {id: req.params.postId}})
        .then(() => res.status(201).json({ message: 'Post supprimé !' })) 
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    }

    console.log(res.locals.roleID);
    db.User.findOne({attributes: ['id', 'roleId'], where: {id: req.body.id}, include: { model: db.Role, attributes: ['deletePost']}})    
    .then(result => {
        if (res.locals.roleID > 1) {
            if(result.deletePost == 1){
                fctDeletePost();
            }
            else {
                throw "1 - vous ne possédez pas assez de droits pour cette action";
            }
        } else if (req.body.id == result.id) {
            fctDeletePost();
        }
        else {
            throw "2 - vous ne possédez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(503).json({ error })); 
};

exports.likePost = (req, res, next) => {
    const likingInput = req.body.liking;
    let userLike = 0
    let userDislike = 0;
    db.Liking.findOne({attributes: ['id', 'postId', 'commentId', 'userId', 'Liking', 'Disliking'], where: {userId: req.body.id, postId: req.params.postId, commentId: null}})
    .then(result => {
        userLike = result.dataValues.Liking;
        userDislike = result.dataValues.Disliking;
        console.log("A Like : "+userLike+" / Dislike : "+userDislike);
        return db.Liking.destroy(
            {where: {postId: req.params.postId, userId: req.body.id}})
        .then(() => res.status(201).json({ message: 'Annulation enregistrée !' }))  
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    })
    .catch(function(error) {
        switch (likingInput) {
            case 1:
                if(userLike === 0 && userDislike === 0) {
                    console.log("B Like : "+userLike+" / Dislike : "+userDislike);
                    return db.Liking.create({
                        postId: req.params.postId,
                        userId: req.body.id,
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
                        postId: req.params.postId,
                        userId: req.body.id,
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

exports.getLikingsForAPost= (req, res, next) => {

    return db.Liking.findAll({
        where: {postId: req.params.postId}, 
        attributes: [sequelize.fn('SUM', sequelize.col('liking')), sequelize.fn('SUM', sequelize.col('disliking'))],
        raw: true                                                                                                                           
    })         
    .then((results) => {
        console.log(results);
        res.status(201).json(results)
      })
    .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
};

exports.doublejointure= (req, res, next) => {

    db.Post.sequelize.query("SELECT Posts.id, userId, Users.username, title, content, Posts.createdAt, Posts.updatedAt, Users.roleId, Roles.updatePost FROM Posts INNER JOIN (Users INNER JOIN Roles ON Users.roleId=Roles.id) ON Posts.userId=Users.id WHERE Posts.id="+req.params.postId, {raw:true, type: sequelize.QueryTypes.SELECT})
    .then((results) => {
        res.status(201).json(results)
      })
    .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));

}
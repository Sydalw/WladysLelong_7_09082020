//on importe le modèle
var modelPost = require('../models/Post');
var modelUser = require('../models/User');
var modelLiking = require('../models/Liking');
var modelRole = require('../models/Role');
const config = require('dotenv').config();
const jwt = require('jsonwebtoken');
const keyValueToken = process.env.key_value_token;
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

modelUser.User.hasMany(modelPost.Post);
modelPost.Post.belongsTo(modelUser.User);
// modelUser.User.hasMany(modelRole.Role);
// modelRole.Role.belongsTo(modelUser.User);

//recherche de tous les posts d'un user
exports.getAllPostsPerUser = (req, res, next) => {          
    modelUser.User.findOne({attributes: ['id', 'username', 'email', 'bio', 'pictureURL', 'roleId', 'creationDate', 'updateDate'], include: modelPost.Post})      
    .then(users => {
        console.log(users);
        res.status(200).json(users);})
    .catch(function (e) {
        //gestion erreur
        res.status(400).json(users);
        console.log(e);
    })
};

// exports.getAllPostsPerUser = (req, res, next) => {          
//     modelPost.Post.findAll({attributes: ['postId', 'title', 'content', 'userId'], include: [{model: modelUser.User, attributes: ['username'], where: {id: req.params.userId}}]})
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
//     modelPost.Post.sequelize.query("SELECT postId, userId, username, title, content, Posts.creationDate, Posts.updateDate FROM Posts INNER JOIN Users ON userId=id WHERE userId="+req.params.userId)
//     .then(([results, metadata]) => {
//         res.status(201).json(results)
//     })
//     .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
// }

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
    var dayDate = new Date();

    return modelPost.Post.create({
        userId: req.body.id,
        title: req.body.title,
        content: req.body.content,
        pictureURL: req.body.pictureURL,
        creationDate: dayDate,
        updateDate: dayDate
    })
    .then(() => res.status(201).json({ message: 'Post créé !' }))          
    .catch((error) => res.status(401).json({ message: 'Post non créé !', error }));
};

exports.updatePost = (req, res, next) => {
    var dayDate = new Date();

    function fctUpdatePost(){
        return modelPost.Post.update({   
            title: req.body.title,
            content: req.body.content,
            pictureURL: req.body.pictureURL,
            updateDate: dayDate},
            {where: {postId: req.params.postId}})
        .then(() => res.status(201).json({ message: 'Post modifié !' }))  
        //traitement terminé...
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    }

    console.log(res.locals.roleID);
    modelPost.Post.sequelize.query("SELECT postId, userId, Users.username, title, content, Posts.creationDate, Posts.updateDate, Users.roleId, Roles.updatePost FROM Posts INNER JOIN (Users INNER JOIN Roles ON Users.roleId=Roles.roleId) ON userId=id WHERE postId="+req.params.postId)
    .then(result => {
        result.forEach(element => console.log(element.postId));
        if (res.locals.roleID > 1) {
            console.log(result);
            console.log(result.postId);
            if(result.updatePost == 1){
                fctUpdatePost();
            }
            else {
                throw "1 - vous ne possédez pas assez de droits pour cette action";
            }
        } else if (req.body.id == result.userId) {
            fctUpdatePost();
        }
        else {
            throw "2 - vous ne possédez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(501).json({ error }));
};

exports.deletePost = (req, res, next) => {
    var dayDate = new Date();

    function fctDeletePost() {
        return modelPost.Post.destroy(
            {where: {postId: req.params.postId}})
        .then(() => res.status(201).json({ message: 'Post supprimé !' })) 
        .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    }

    console.log(res.locals.roleID);
    modelPost.Post.sequelize.query("SELECT postId, userId, Users.username, title, content, Posts.creationDate, Posts.updateDate, Users.roleId, Roles.deletePost FROM Posts INNER JOIN (Users INNER JOIN Roles ON Users.roleId=Roles.roleId) ON userId=id WHERE postId="+req.params.postId)
    .then(result => {
        if (res.locals.roleID > 1) {
            console.log(result.postId);
            if(result.updatePost == 1){
                fctDeletePost();
            }
            else {
                throw "1 - vous ne possédez pas assez de droits pour cette action";
            }
        } else if (req.body.id == result.userId) {
            fctDeletePost();
        }
        else {
            throw "2 - vous ne possédez pas assez de droits pour cette action";
        }
    })
    .catch(error => res.status(501).json({ error })); 
};

exports.likePost = (req, res, next) => {
    const likingInput = req.body.liking;
        switch (likingInput) {
            case 1:
                return modelLiking.Liking.create({
                    postId: req.params.postId,
                    userId: req.body.id,
                    liking: true,
                    disliking: false
                })
                .then(() => res.status(201).json({ message: 'Like enregistré !' }))          
                .catch((error) => res.status(401).json({ message: 'Like non enregistré !', error }));
                break;
            case 0:
                return modelLiking.Liking.destroy(
                    {where: {postId: req.params.postId, userId: req.body.id}})
                .then(() => res.status(201).json({ message: 'Annulation enregistrée !' }))  
                //traitement terminé...
                .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
                break;
            case -1:
                return modelLiking.Liking.create({
                    postId: req.params.postId,
                    userId: req.body.id,
                    disliking: true,
                    liking: false
                })
                .then(() => res.status(201).json({ message: 'Dislike enregistré !' }))          
                .catch((error) => res.status(401).json({ message: 'Dislike non enregistré !', error }));
        }
};

exports.getLikingsForAPost= (req, res, next) => {

    modelRole.Role.sequelize.query("SELECT SUM(liking) as Likes, SUM(disliking) as Dislikes FROM Likings WHERE postId="+req.params.postId)
    .then(([results, metadata]) => {
        res.status(201).json(results)
      })
    .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));
    
};

exports.doublejointure= (req, res, next) => {

    modelPost.Post.sequelize.query("SELECT postId, userId, Users.username, title, content, Posts.creationDate, Posts.updateDate, Users.roleId, Roles.updatePost FROM Posts INNER JOIN (Users INNER JOIN Roles ON Users.roleId=Roles.roleId) ON userId=id WHERE postId="+req.params.postId)
    .then(([results, metadata]) => {
        res.status(201).json(results)
      })
    .catch((error) => res.status(401).json({ message: 'Une erreur est apparue !', error }));

}
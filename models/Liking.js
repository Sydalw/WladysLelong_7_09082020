const { Sequelize } = require('sequelize');
var sequelize = require('../sequelize');

//  USER
const Liking = sequelize.define('likesDislikes', {
    likingId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    postId: {type: Sequelize.INTEGER, allowNull: true, unique: false},
    commentId: {type: Sequelize.INTEGER, allowNull: true, unique: false},
    userId: {type: Sequelize.INTEGER, allowNull: true, unique: false},
    like: {type: Sequelize.INTEGER, allowNull: false, unique: false},
    dislike: {type: Sequelize.INTEGER, allowNull: false, unique: false},
},
        {tableName: 'likesDislikes', timestamps: false, underscored: false}
);
exports.Liking = Liking; 
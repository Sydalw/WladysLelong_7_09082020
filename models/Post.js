const { Sequelize } = require('sequelize');
var sequelize = require('../sequelize');

//  USER
const Post = sequelize.define('Posts', {
    postId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    userId: {type: Sequelize.INTEGER, allowNull: true, unique: false},
    title: {type: Sequelize.STRING(255), allowNull: false, unique: false},
    content: {type: Sequelize.TEXT, allowNull: false, unique: false},
    pictureURL: {type: Sequelize.STRING(255), allowNull: true, unique: false},
    creationDate: {type: Sequelize.DATE, allowNull: false, unique: false},
    updateDate: {type: Sequelize.DATE, allowNull: false, unique: false},
},
        {tableName: 'Posts', timestamps: false, underscored: false}
);
exports.Post = Post; 
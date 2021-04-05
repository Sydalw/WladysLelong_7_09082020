const { Sequelize } = require('sequelize');
var sequelize = require('../sequelize');

//  USER
const Comment = sequelize.define('Comments', {
    commentId: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    postId: {type: Sequelize.INTEGER, allowNull: false, unique: false},
    userId: {type: Sequelize.INTEGER, allowNull: true, unique: false},
    relatedComment: {type: Sequelize.INTEGER, allowNull: true, unique: false},
    content: {type: Sequelize.TEXT, allowNull: false, unique: false},
    creationDate: {type: Sequelize.DATE, allowNull: false, unique: false},
    updateDate: {type: Sequelize.DATE, allowNull: false, unique: false},
},
        {tableName: 'Comments', timestamps: false, underscored: false}
);
exports.Comment = Comment; 
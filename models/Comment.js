const { Sequelize } = require('sequelize');
var sequelize = require('../sequelize');

//  USER
const Comment = sequelize.define('Comments', {
    commentId: {type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
    postId: {type: Sequelize.INTEGER.UNSIGNED, allowNull: false, unique: false},
    userId: {type: Sequelize.INTEGER.UNSIGNED, allowNull: true, unique: false},
    relatedComment: {type: Sequelize.INTEGER.UNSIGNED, allowNull: true, unique: false},
    content: {type: Sequelize.TEXT, allowNull: false, unique: false},
    creationDate: {type: Sequelize.DATE, allowNull: false, unique: false},
    updateDate: {type: Sequelize.NOW, allowNull: false, unique: false},
    deletionFlag: {type: Sequelize.BOOLEAN, allowNull: false},
},
        {tableName: 'Comments', timestamps: false, underscored: false}
);
exports.Comment = Comment; 
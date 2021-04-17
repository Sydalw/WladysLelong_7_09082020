const { Sequelize } = require('sequelize');
var sequelize = require('../sequelize');

//  USER
const Liking = sequelize.define('Likings', {
    likingId: {type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
    postId: {type: Sequelize.INTEGER.UNSIGNED, allowNull: true, unique: false},
    commentId: {type: Sequelize.INTEGER.UNSIGNED, allowNull: true, unique: false},
    userId: {type: Sequelize.INTEGER.UNSIGNED, allowNull: false, unique: false},
    liking: {type: Sequelize.BOOLEAN, allowNull: false, unique: false},
    disliking: {type: Sequelize.BOOLEAN, allowNull: false, unique: false},
},
        {tableName: 'Likings', timestamps: false, underscored: false}
);
exports.Liking = Liking; 
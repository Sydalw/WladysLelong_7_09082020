const { Sequelize, BOOLEAN } = require('sequelize');
var sequelize = require('../sequelize');

//  ROLE
const Role = sequelize.define('Roles', {
    roleId: {type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true},
    roleName: {type: Sequelize.STRING(40), allowNull: false, unique: true},
    updateUser: {type: BOOLEAN, allowNull: false},
    deleteUser: {type: BOOLEAN, allowNull: false},
    updatePost: {type: BOOLEAN, allowNull: false},
    deletePost: {type: BOOLEAN, allowNull: false},
    updateComment: {type: BOOLEAN, allowNull: false},
    deleteComment: {type: BOOLEAN, allowNull: false},
},
        {tableName: 'Roles', timestamps: false, underscored: false}
);
exports.Role = Role; 
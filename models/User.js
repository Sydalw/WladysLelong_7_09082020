const { Sequelize } = require('sequelize');
var sequelize = require('../sequelize');

//  USER
const User = sequelize.define('Users', {
    id: {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
    username: {type: Sequelize.STRING(255), allowNull: false, unique: true},
    email: {type: Sequelize.STRING(255), allowNull: false, unique: true},
    password: {type: Sequelize.STRING(255), allowNull: false, unique: true},
    bio: {type: Sequelize.STRING(255), allowNull: true, unique: false},
    pictureURL: {type: Sequelize.STRING(255), allowNull: true, unique: false},
    roleId: {type: Sequelize.INTEGER, allowNull: false, unique: false},
    creationDate: {type: Sequelize.DATE, allowNull: false, unique: false},
    updateDate: {type: Sequelize.DATE, allowNull: false, unique: false},
},
        {tableName: 'Users', timestamps: false, underscored: false}
);
exports.User = User; 
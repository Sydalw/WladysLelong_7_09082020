'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post)
      User.belongsTo(models.Role, {foreignKey: 'roleId'})
    }
  };
  User.init({
    username: {type: DataTypes.STRING(255), allowNull: false, unique: true},
    name: {type: DataTypes.STRING(40), allowNull: false, unique: false},
    surname: {type: DataTypes.STRING(40), allowNull: false, unique: false},
    email: {type: DataTypes.STRING(255), allowNull: false, unique: true},
    password: {type: DataTypes.STRING(255), allowNull: false, unique: true},
    bio: {type: DataTypes.STRING(255), allowNull: true, unique: false},
    pictureURL: {type: DataTypes.STRING(255), allowNull: true, unique: false},
    roleId: {type: DataTypes.INTEGER, allowNull: false, unique: false}
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.User, {foreignKey: 'id'})
    }
  };
  Role.init({
    roleName: {type: DataTypes.STRING(40), allowNull: false, unique: true},
    updateUser: {type: DataTypes.BOOLEAN, allowNull: false},
    deleteUser: {type: DataTypes.BOOLEAN, allowNull: false},
    updatePost: {type: DataTypes.BOOLEAN, allowNull: false},
    deletePost: {type: DataTypes.BOOLEAN, allowNull: false},
    updateComment: {type: DataTypes.BOOLEAN, allowNull: false},
    deleteComment: {type: DataTypes.BOOLEAN, allowNull: false}
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};
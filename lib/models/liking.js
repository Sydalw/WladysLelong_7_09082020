'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Liking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Liking.belongsTo(models.User, {foreignKey: 'userId'})
      Liking.belongsTo(models.Comment, {foreignKey: 'commentId'})
      Liking.belongsTo(models.Post, {foreignKey: 'postId'})
    }
  };
  Liking.init({
    postId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: true, unique: false},
    commentId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: true, unique: false},
    userId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: false},
    liking: {type: DataTypes.BOOLEAN, allowNull: false, unique: false},
    disliking: {type: DataTypes.BOOLEAN, allowNull: false, unique: false}
  }, {
    sequelize,
    modelName: 'Liking',
  });
  return Liking;
};
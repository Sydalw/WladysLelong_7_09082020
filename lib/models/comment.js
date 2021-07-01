'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {foreignKey: 'userId'})
      Comment.belongsTo(models.Post, {foreignKey: 'postId'})
      Comment.hasMany(models.Liking, {foreignKey: 'id'})
    }
  };
  Comment.init({
    postId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: false},
    userId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: true, unique: false},
    relatedComment: {type: DataTypes.INTEGER.UNSIGNED, allowNull: true, unique: false},
    content: {type: DataTypes.TEXT, allowNull: false, unique: false},
    deletionFlag: {type: DataTypes.BOOLEAN, allowNull: false},
    indentationLevel: {type: DataTypes.INTEGER.UNSIGNED, allowNull: false}
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
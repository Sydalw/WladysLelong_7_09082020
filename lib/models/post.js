'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {foreignKey: 'userId'})
      Post.hasMany(models.Comment, {foreignKey: 'id'})
      Post.hasMany(models.Liking, {foreignKey: 'id'})
    }
  };
  Post.init({
    userId: {type: DataTypes.INTEGER.UNSIGNED, allowNull: true, unique: false},
    title: {type: DataTypes.STRING(255), allowNull: false, unique: false},
    content: {type: DataTypes.TEXT, allowNull: false, unique: false},
    pictureURL: {type: DataTypes.STRING(255), allowNull: true, unique: false}
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
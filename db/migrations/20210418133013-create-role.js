'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      roleName: {
        type: Sequelize.STRING
      },
      updateUser: {
        type: Sequelize.BOOLEAN
      },
      deleteUser: {
        type: Sequelize.BOOLEAN
      },
      updatePost: {
        type: Sequelize.BOOLEAN
      },
      deletePost: {
        type: Sequelize.BOOLEAN
      },
      updateComment: {
        type: Sequelize.BOOLEAN
      },
      deleteComment: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Roles');
  }
};
'use strict';
const { Sequelize } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   console.log('hello')
   return queryInterface.createTable('tb_users', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUID, primaryKey: true},
      firstName: { type: Sequelize.STRING(64), allowNull: false }, 
      lastName: { type: Sequelize.STRING(128), allowNull: false },
      email: { type: Sequelize.STRING(64), allowNull: false, validate: { isEmail: true } },
      isEmailVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Date.UTC },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Date.UTC },
      isLocked: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      isArchived: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
    })
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('tb_users')
  }
};

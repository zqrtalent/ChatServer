'use strict';
const { Sequelize } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    try{
      const result = await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.addIndex('tb_users', ['email'], {
          name: 'idx_users_email',
          unique: true,
          transaction: t
        })

        await queryInterface.addColumn('tb_users', 'passwordHash', 
          { type: Sequelize.STRING(255), allowNull: false }, 
          { transaction: t })
      })
    }
    catch (error) {
      // If the execution reaches this line, an error occurred.
      // The transaction has already been rolled back automatically by Sequelize!
      throw error
    }
  },

  down: async (queryInterface) => {
    try{
      const result = await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.removeIndex('tb_users', 'idx_users_email', { transaction: t })
        await queryInterface.removeColumn('tb_users', 'passwordHash', { transaction: t })
      })
    }
    catch (error) {
      // If the execution reaches this line, an error occurred.
      // The transaction has already been rolled back automatically by Sequelize!
      throw error
    }
  }
};

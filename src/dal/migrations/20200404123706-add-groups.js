'use strict';
const { Sequelize } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    try{
      const result = await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable('tb_groups', {
            id: { type: Sequelize.UUID(), primaryKey: true },
            userId: { type: Sequelize.UUID(), allowNull: false },
            name: { type: Sequelize.STRING(100), allowNull: false },
            createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Date.UTC },
            updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Date.UTC },
        }, {transaction: t})

        await queryInterface.addIndex('tb_groups', ['userId'], {
          name: 'idx_groups_userid',
          unique: false,
          transaction: t
        })
      })
      return result
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
        await queryInterface.dropTable('tb_groups', { transaction: t })
        await queryInterface.removeIndex('tb_groups', 'idx_groups_userid', { transaction: t })
      })
      return result
    }
    catch (error) {
      // If the execution reaches this line, an error occurred.
      // The transaction has already been rolled back automatically by Sequelize!
      throw error
    }
  }
};

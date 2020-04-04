'use strict';
const { Sequelize } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    try{
      const result = await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable('tb_messages', {
          id: { type: Sequelize.UUID(), primaryKey: true },
          groupId: { type: Sequelize.UUID(),  allowNull: false },
          userId: { type: Sequelize.UUID(), allowNull: false },
          text: { type: Sequelize.STRING(255), allowNull: false },
          createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Date.UTC },
        }, {transaction: t})

        await queryInterface.addIndex('tb_messages', ['groupId', 'createdAt'], {
          name: 'idx_messages_groupid_createdat',
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
        await queryInterface.removeIndex('tb_messages', 'idx_messages_groupid_createdat', { transaction: t })
        await queryInterface.dropTable('tb_messages', { transaction: t })
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

'use strict';
const { Sequelize } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    try{
      const result = await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable('tb_members', {
          id: { type: Sequelize.UUID(), primaryKey: true },
          groupId: { type: Sequelize.UUID(), allowNull: false },
          userId: { type: Sequelize.UUID(),  allowNull: false}
          }, {transaction: t})

        await queryInterface.addIndex('tb_members', ['groupId'], {
          name: 'idx_members_groupid',
          unique: false,
          transaction: t
        })

        await queryInterface.addIndex('tb_members', ['userId'], {
          name: 'idx_members_userid',
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
        await queryInterface.removeIndex('tb_members', 'idx_members_groupid', { transaction: t })
        await queryInterface.removeIndex('tb_members', 'idx_members_userid', { transaction: t })
        await queryInterface.dropTable('tb_members', { transaction: t })
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

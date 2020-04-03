const { Sequelize, Model, DataTypes } = require('sequelize')

const init = (sequelize) => {
    return sequelize.define('Members', 
    {
        id: { type: DataTypes.UUIDV1(), primaryKey: true },
        groupId: { type: DataTypes.UUIDV1(), allowNull: false },
        userId: { type: DataTypes.UUIDV1(), allowNull: false }
    },
    {
        // // Sequelize instance
        // sequelize, 
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
        // disable the modification of table names; By default, sequelize will automatically
        // transform all passed model names (first parameter of define) into plural.
        // if you don't want that, set the following
        freezeTableName: true,
        // define the table's name
        tableName: 'tb_members',
        modelName: 'Members',
        // define indexes
        indexes: [
            {
                unique: false,
                fields: ['groupId']
            },
            {
                unique: false,
                fields: ['userId']
            }
        ],
    })
}

module.exports = init
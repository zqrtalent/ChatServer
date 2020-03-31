const { Sequelize, Model, DataTypes } = require('sequelize')

const init = (sequelize) => {
    const entityType = sequelize.define('MessageLogs', 
    {
        id: { type: DataTypes.UUIDV1(64), primaryKey: true },
        groupId: { type: DataTypes.UUIDV1(64), allowNull: false },
        userId: { type: DataTypes.UUIDV1(64), allowNull: false },
        text: { type: DataTypes.STRING(255), allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.UTC },
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
        tableName: 'tb_messagelogs',
        modelName: 'MessageLogs',
    })

    // entityType['associate'] = (models) => {
    //     entityType.belongsToMany(models.Conversations, { through: 'ConversationParticipants', foreignKey: 'participantId' });
    // }

    return entityType
}

module.exports = init
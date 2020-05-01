const { Sequelize, Model, DataTypes } = require('sequelize')

const init = (sequelize) => {
    const entityType = sequelize.define('Messages', 
    {
        id: { type: DataTypes.UUIDV1(), primaryKey: true },
        groupId: { type: DataTypes.UUIDV1(), allowNull: false },
        userId: { type: DataTypes.UUIDV1(), allowNull: false },
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
        tableName: 'tb_messages',
        modelName: 'Messages',
        // define indexes
        indexes: [
            {
                unique: false,
                fields: ['groupId', 'createdAt']
            }
        ],
        // Hooks
        hooks: {
            afterCreate: (message, options) => {
                
            },
            afterBulkCreate: (messages, options) => {

            },
        },
    })

    entityType['associate'] = (models) => {
        entityType.Users = entityType.belongsTo(models.Users, { foreignKey: 'userId' });
        entityType.Groups = entityType.belongsTo(models.Groups, { foreignKey: 'groupId' });
    }

    return entityType
}

module.exports = init
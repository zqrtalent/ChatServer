const { Sequelize, Model, DataTypes } = require('sequelize')

const init = (sequelize) => {
    const entityType = sequelize.define('Groups', 
    {
        id: { type: DataTypes.UUIDV1(), primaryKey: true },
        userId: { type: DataTypes.UUIDV1(), allowNull: false },
        name: { type: DataTypes.STRING(100), allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.UTC },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.UTC },
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
        tableName: 'tb_groups',
        modelName: 'Groups',
        // define indexes
        indexes: [
            {
                unique: false,
                fields: ['userId']
            }
        ],
    })

    entityType['associate'] = (models) => {
        entityType.Users =  entityType.belongsTo(models.Users, { foreignKey: 'userId' });
        entityType.Members = entityType.hasMany(models.Members, { foreignKey: 'groupId' });
    }

    return entityType
}

module.exports = init
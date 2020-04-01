const { Sequelize, Model, DataTypes } = require('sequelize')

const init = (sequelize) => {
    return sequelize.define('Users', 
    {
        id: { type: DataTypes.UUIDV1(), primaryKey: true },
        firstName: { type: DataTypes.STRING(64), allowNull: false },
        lastName: { type: DataTypes.STRING(128), allowNull: false },
        email: { type: DataTypes.STRING(64), allowNull: false, validate: { isEmail: true } },
        isEmailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.UTC },
        updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.UTC },
        isLocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        isArchived: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        passwordHash: { type: DataTypes.STRING(255), allowNull: false },
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
        tableName: 'tb_users',
        modelName: 'Users',
        // define indexes
        indexes: [
            {
                unique: true,
                fields: ['email']
            }
        ],
    })
}

module.exports = init
const username = process.env.DB_USERNAME || 'root'
const password = process.env.DB_PASSWORD || 'pass123'
const database = process.env.DB_DATABASE || 'chatdb_dev'
const host = process.env.DB_HOST || 'localhost'
const dialect = process.env.DB_DIALECT || 'mysql'
const migrationStorage = process.env.DB_STORAGE || 'sequelize'
const minPoolSize = process.env.DB_MINPOOLSIZE || 1
const maxPoolSize = process.env.DB_MAXPOOLSIZE || 5

module.exports = {
    username,
    password,
    database,
    host,
    dialect,
    migrationStorage,
    minPoolSize,
    maxPoolSize
}
const { migrationservice } = require('../dal')

const execute = async (emitter, logger, opts) => {
    const migrateSchema = async () => {
        const dbmigration = migrationservice({
            consoleLogging: opts.consoleLogging || false
        })
        return await dbmigration.up()
    }
    const success = await migrateSchema()
    logger.info(`db migration status: ${success}`)
    if(success){
        emitter.emit('migration.done')
    }
    else{
        emitter.emit('onerror', `migration: database migration completed without success`)
    }
}

module.exports = execute
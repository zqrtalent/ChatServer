const path = require('path')
const initdatabase = require('../entities')
const Umzug = require('umzug')

const migrate = (opts) => {
    const _database = initdatabase({
        consoleLogging: opts.consoleLogging || false
    })
    const sequelize = _database.sequelize

    const umzug = new Umzug({
        migrations: {
          // indicates the folder containing the migration .js files
          path: path.join(__dirname, '../migrations'),
          // inject sequelize's QueryInterface in the migrations
          params: [
            sequelize.getQueryInterface()
          ]
        },
        // indicates that the migration data should be store in the database
        // itself through sequelize. The default configuration creates a table
        // named `SequelizeMeta`.
        storage: 'sequelize',
        storageOptions: {
          sequelize: sequelize
        }
    })

    const up = async () => {
      let migrations = null
      try{
        migrations = await umzug.up()
      }
      catch(err){
        console.log(err.toString())
        return false
      }
      return true
    }

    const down = async (toMigration) => {
      let migrations = null
        try{
          migrations = await umzug.down({ to: toMigration})
        }
        catch(err){
          console.log(err.toString())
          return false
        }
        return true
    }

    return {
        up,
        down
    }
}

module.exports = migrate
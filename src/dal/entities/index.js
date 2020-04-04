const { Sequelize, Options, Model } = require('sequelize')
const { db } = require('../../config')
const { join } = require('path')

const init = (opts) => {
  const sequelize = new Sequelize({
    database: db.database,
    username: db.username,
    password: db.password,
    host: db.host,
    port: db.port,
    dialect: db.dialect,
    pool: {
        min: db.minPoolSize,
        max: db.maxPoolSize,
    },
    storage: db.storage,
    // Enable/Disable console logging.
    logging: opts.consoleLogging
  })

  let database = {
    sequelize: null,
    models: {}
  }

  // Define entity models. [START]
  const loadModels = [
    // TODO: add model file name and callback here.
    // -------------------------------------------
    { modelFile: 'users', callback: m => { database['User'] = m }},
    { modelFile: 'groups', callback: m => { database['Group'] = m }},
    { modelFile: 'members', callback: m => { database['Member'] = m }},
    { modelFile: 'messages', callback: m => { database['Message'] = m }},
  ]
  // Define entity models. [END]

  // Load models.
  for(const l of loadModels){
    const model = sequelize['import'](join(__dirname, l.modelFile));
    database.models[model.name] = model
    l.callback(model)
  }

  // Associate models to each other.
  Object.keys(database.models).forEach(modelName => {
    if (database.models[modelName]['associate']) {
      database.models[modelName]['associate'](database.models);
    }
  });

  // Synchronize models with database.
  if(opts.syncModels || false){
    const modelNames = Object.keys(database.models)
    modelNames.forEach(n => {
      database.models[n].sync()
    });
  }

  database.sequelize = sequelize
  return database
}

module.exports = init
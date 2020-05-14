const { logging } = require('../config')

switch(logging.provider){
    case 'seq':{
        module.exports = require('./services/seq.logging.service')({})
        break
    }
    default: {
        module.exports = require('./services/console.logging.service')({})
        break
    }
}
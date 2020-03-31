const redis = require('redis')
const { promisify } = require('util')

const init = (opts) => {
    let client = redis.createClient({
        host: opts.host || '0.0.0.0',
        port: opts.port || 6379
    })
    
    const getAsync = promisify(client.get).bind(client)
    const rpushAsync = promisify(client.rpush).bind(client)
    const lremAsync = promisify(client.lrem).bind(client)
    const llenAsync = promisify(client.llen).bind(client)
    const lrangeAsync = promisify(client.lrange).bind(client)
    const brpopAsync = promisify(client.brpop).bind(client)
    const rpopAsync = promisify(client.rpop).bind(client)

    const setValue = (k, v) => {
        return client.set(k, typeof(v) !== 'string' ? JSON.stringify(v) : v)
    }
    
    const getValue = async (k) => {
        return await getAsync(k)
    }

    const popValue = async (k, timeout) => {
        if(timeout <= 0)
            return await rpopAsync(k)
        return await brpopAsync(k, timeout)
    }

    const pushListItems = async (k, items) => {
        if(!items)
            throw new Error('Parameter error items!')
        if(items.length == 0)
            return false;
        const itemsAsString = items.map(x => {
            return typeof(x) !== 'string' ? JSON.stringify(x) : v
        })
        return await rpushAsync(k, itemsAsString)
    }

    const clearListItems = async (k) => {
        return await lremAsync(k, 0) // return number of removed items.
    }

    const getListItemsCount = async (k) => {
        return await llenAsync(k) // return number of list items.
    }

    const getListItems = async (k, start, end = -1) => {
        return await lrangeAsync(k, start, end) // returns array within the range
    }

    return {
        setValue,
        getValue,
        popValue,
        pushListItems,
        clearListItems,
        getListItemsCount,
        getListItems
    }
}

module.exports = init
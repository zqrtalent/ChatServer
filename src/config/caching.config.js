const host = process.env.CACHE_HOST || '0.0.0.0'
const port = process.env.CACHE_PORT || 6379

module.exports = {
    host,
    port
}
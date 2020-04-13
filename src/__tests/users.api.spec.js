const supertest = require('supertest')
const createServer = require('../server')

before

describe('Testing User api', () => {
    const services = {
        usersService: null,
        groupService: null,
        cacheClient: null,
        queueService: null,
        passport: null,
        poolingService: null,
        logger: null
    }

    it('User signup api test', async () => {
        const server = createServer(services)
        const resp = await supertest(server).post('/user/signup')

        expect(resp.status).toBe(200)
    })
})
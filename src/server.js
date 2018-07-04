
const Hapi = require('hapi')

const { Article } = require('./models')

const server = Hapi.server({
  host: 'localhost',
  port: 3000
})

server.route({
  method: 'GET',
  path: '/',
  handler: () => {
    // return [{ so: 'hapi!' }]
    // return 123
    // return `HTML rules!`
    // return null
    // return new Error('Boom')
    // return Promise.resolve({ whoa: true })
    return require('fs').createReadStream('index.html')
  }
})

server.start().then(() => {
  console.log('Server running at:', server.info.uri)
}).catch(err => {
  console.log(err)
  process.exit(1)
})

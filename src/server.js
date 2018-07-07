
const Hapi = require('hapi')

const { configureAuth } = require('./auth')
const { configureRoutes } = require('./routes')

const server = Hapi.server({
  host: 'localhost',
  port: 3000,
  routes: {
    cors: {
      credentials: true
      // See options at https://hapijs.com/api/17.0.0#-routeoptionscors
    }
  }
})

// This function will allow us to easily extend it later
const main = async () => {
  await configureAuth(server)
  await configureRoutes(server)
  await server.start()

  return server
}

main().then(server => {
  console.log('Server running at:', server.info.uri)
}).catch(err => {
  console.log(err)
  process.exit(1)
})

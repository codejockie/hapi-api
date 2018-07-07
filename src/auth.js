const jwtPlugin = require('hapi-auth-jwt2').plugin
// This would be in an environment variable in production
const JWT_KEY = 'NeverShareYourSecret'

var validate = function (credentials) {
  // Run any checks here to confirm we want to grant these credentials access
  return {
    isValid: true,
    credentials // request.auth.credentials
  }
}

exports.configureAuth = async (server) => {
  await server.register(jwtPlugin)
  server.auth.strategy('admin', 'jwt', {
    key: JWT_KEY,
    validate,
    verifyOptions: { algorithms: [ 'HS256' ] }
  })

  // Default all routes to require JWT and opt out for public routes
  server.auth.default('admin')
}
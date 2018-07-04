const Boom = require('boom')

const { Article } = require('./models')

exports.configureRoutes = (server) => {
  // server.route accepts an object or an array
  return server.route([{
    method: 'GET',
    path: '/articles',
    handler: () => {
      return Article.findAll()
    }
  }, {
    method: 'GET',
    // The curly braces are how we define params (variable path segments in the URL)
    path: '/articles/{id}',
    handler: async (request) => {
      const article = await Article.findById(request.params.id)
      if (article === null) return Boom.notFound()

      return article
    }
  }, {
    method: 'POST',
    path: '/articles',
    handler: (request) => {
      const article = Article.build(request.payload.article)

      return article.save()
    }
  }, {
    // method can be an array
    method: ['PUT', 'PATCH'],
    path: '/articles/{id}',
    handler: async (request) => {
      const article = await Article.find(request.params.id)
      article.update(request.payload.article)

      return article.save()
    }
  }, {
    method: 'DELETE',
    path: '/articles/{id}',
    handler: async (request) => {
      const article = await Article.find(request.params.id)

      return article.destroy()
    }
  }])
}
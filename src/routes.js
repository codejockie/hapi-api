const Boom = require('boom')
const Joi = require('joi')

const { Article, Comment } = require('./models')
const { login } = require('./auth')

exports.configureRoutes = (server) => {
  // server.route accepts an object or an array
  return server.route([{
    method: 'GET',
    path: '/',
    handler: () => {
      return require('fs').createReadStream('index.html')
    },
    config: { auth: false }
  }, {
    method: 'GET',
    path: '/articles',
    handler: () => {
      return Article.findAll()
    },
    config: { auth: false }
  }, {
    method: 'GET',
    // The curly braces are how we define params (variable path segments in the URL)
    path: '/articles/{id}',
    handler: async (request) => {
      const article = await Article.findById(request.params.id)
      if (article === null) return Boom.notFound()

      const comments = await article.getComments()

      return { ...article.get(), comments }
    },
    config: { auth: false }
  }, {
    method: 'POST',
    path: '/articles',
    handler: (request) => {
      const article = Article.build(request.payload.article)

      return article.save()
    },
    config: {
      validate: {
        payload: {
          article: {
            title: Joi.string().min(3).max(10),
            body: Joi.string().required()
          }
        }
      }
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
  }, {
    method: 'POST',
    path: '/articles/{id}/comments',
    handler: async (request) => {
      const article = await Article.find(request.params.id)
  
      return article.createComment(request.payload.comment)
    },
    config: { auth: false }
  }, {
    method: 'DELETE',
    path: '/articles/{articleId}/comments/{id}',
    handler: async (request) => {
      const { id, articleId } = request.params
      // You can pass options to findById as a second argument
      const comment = await Comment.find(id, { where: { articleId } })
  
      return comment.destroy()
    }
  }, {
    method: 'POST',
    path: '/authentications',
    handler: async (request) => {
      const { email, password } = request.payload.login
  
      return login(email, password)
    },
    config: { auth: false }
  }])
}
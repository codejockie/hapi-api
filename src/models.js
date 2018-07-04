const path = require('path')
const Sequelize = require('sequelize')
const Boom = require('boom')

Sequelize.Model.find = async function (...args) {
  const obj = await this.findById(...args)
  if (obj === null) throw Boom.notFound()

  return obj
}

// configure connection to db host, user, pass - not required for SQLite
const sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: path.join('tmp', 'db.sqlite') // SQLite persists its data directly to file
})

// Here we define our Article model with a title attribute of type string, and a body attribute of type text. By default, all tables get columns for id, createdAt, updatedAt as well.
const Article = sequelize.define('article', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT
})

const Comment = sequelize.define('comment', {
  commenter: Sequelize.STRING,
  body: Sequelize.TEXT
})

// These associations add an articleId foreign key to our comments table
// They add helpful methods like article.getComments() and article.createComment()
Article.hasMany(Comment)
Comment.belongsTo(Article)

// Create tables
Article.sync()
Comment.sync()

module.exports = {
  Article,
  Comment
}
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info(`baza connecting to ${config.MONGODB_URI}`)

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to baza')
	})
	.catch((error) => {
		logger.error(`error connecting to baza: ${error.message}`)
	})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.uknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app

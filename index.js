// const config = require('./utils/config')
// const express = require('express')
// const http = require('http')
// const app = express()
// const cors = require('cors')
// const blogsRouter = require('./controllers/blogs')
// const mongoose = require('mongoose')
// const logger = require('./utils/logger')

// mongoose.connect(config.MONGODB_URI)

// app.use(cors())
// app.use(express.json())

// app.use('/api/blogs', blogsRouter)
// logger.info(`connected to baza ${config.MONGODB_URI}`)

// app.listen(config.PORT, () => {
// 	logger.info(`Server running on port ${config.PORT}`)
// })

const http = require('http')
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
	logger.info(`Server is up and running on port ${config.PORT}`)
})


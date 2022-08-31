const config = require('./utils/config')
const express = require('express')
const http = require('http')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())


app.use('/api/blogs', blogsRouter)
logger.info(`connected to baza ${config.MONGODB_URI}`)



// app.get('/api/blogs', async (request, response) => {
// 	const blogs = await Blog.find({})
// 	response.json(blogs)
// })

// app.post('/api/blogs', async (request, response) => {
// 	const blog = new Blog(request.body)

// 	const result = await blog.save()
// 	response.status(201).json(result)
// })

app.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`)
})


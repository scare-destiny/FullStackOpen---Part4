const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

// const getTokenFrom = request => {
// 	const authorization = request.get('authorization')
// 	if (authorization && authorization.toLowerCase().startsWith('bearer')) {
// 		return authorization.substring(7)
// 	}
// }

blogsRouter.post('/', async (request, response) => {
	const body = request.body
	console.log(request.token)
	const decodedToken = jwt.verify(request.token, process.env.SECRET)


	if (!request.token || !decodedToken.id) {
		return response.status(401).json({error: 'token missing or invalid '})
	}

	const user = await User.findById(decodedToken.id)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes !== undefined ? body.likes : 0,
		user: user.id,
	})

	if (body.title && body.url) {
		const savedBlog = await blog.save()
		user.blogs = user.blogs.concat(savedBlog.id)
		await user.save()
		response.status(201).json(savedBlog)
	} else {
		response.status(400).end()
	}
})

blogsRouter.delete('/:id', async (request, response) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET) 
	if (!request.token || !decodedToken.id) {
			return response.status(401).json({ error: 'token missing or invalid' })
	}
	
	const blog = await Blog
	.findById(request.params.id)

	if (decodedToken.id.toString() !== blog.user.toString()) {
			return response.status(404).json({ error: 'user is only able to delete blogs that they have added' })
	} 

	await blog.remove()
	response.status(204).end()
})


blogsRouter.put('/:id', (request, response, next) => {
	const body = request.body

	const blog = {
		likes: body.likes,
	}

	Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
		.then((updatedBlog) => {
			response.json(updatedBlog)
		})
		.catch((error) => next(error))
})

module.exports = blogsRouter

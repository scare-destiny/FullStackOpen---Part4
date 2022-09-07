const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')


beforeEach(async () => {
	await Blog.deleteMany({})

	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
	const promiseArray = blogObjects.map((blog) => blog.save())
	await Promise.all(promiseArray)
})

test('blogs posts are returned in the correct number', async () => {
	const response = await api.get('/api/blogs')

	expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
	const response = await api.get('/api/blogs')
	const ids = response.body.map((blog) => blog.id)
	expect(ids).toBeDefined()
})

test('a new blog post can be added only with a token', async () => {
	const user = {
		username: 'test',
		name: 'test',
		password: 'test',
	}

	const response = await api
		.post('/api/login')
		.send(user)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const token = response.body.token

	const newBlogPost = {
		title: 'Game of Thrones',
		author: 'Martin',
		url: 'hmm',
		likes: 99999,
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `bearer ${token}`)
		.send(newBlogPost)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

	const titles = blogsAtEnd.map((b) => b.title)
	expect(titles).toContain('Game of Thrones')
}, 100000)

test('if the likes property is missing, default to the value 0', async () => {
	const newBlogPost = {
		title: 'Game of Thrones',
		author: 'Martin',
		url: 'ulalla',
	}

	await api
		.post('/api/blogs')
		.send(newBlogPost)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()

	const likes = blogsAtEnd.map((b) => b.likes)
	expect(likes).toContain(0)
}, 10000)

test('blog post without title and url is not added', async () => {
	const newBlogPost = {author: 'king', likes: 20}

	await api.post('/api/blogs').send(newBlogPost).expect(400)

	const blogsAtEnd = await helper.blogsInDb()
	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('if blog has valid id, it can be deleted, response will be status code 204', async () => {
		const user = {
			username: 'piska',
			name: 'bbb',
			password: '1134dd',
		}

		// await api
		// 	.post('/api/users')
		// 	.send(user)
		// 	.expect(201)
		// 	.expect('Content-Type', /application\/json/)
		

	const response = await api
		.post('/api/login')
		.send(user)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const token = response.body.token

	const newBlog = {
		title: 'Test Blog',
		author: 'Test Author',
		url: 'https://testsite.com/',
		likes: 1,
	}

	await api
		.post('/api/blogs')
		.send(newBlog)
		.set('Authorization', `bearer ${token}`)
		.expect(201)
		.expect('Content-Type', /application\/json/)

	const blogs = await api.get('/api/blogs')
	const blogToDelete = blogs.body[blogs.body.length - 1]

	await api
		.delete(`/api/blogs/${blogToDelete.id}`)
		.set('Authorization', `bearer ${token}`)
		.expect(204)

	const blogsAtEnd = await helper.blogsInDb()

	expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

	const ids = blogsAtEnd.map((r) => r.id)

	expect(ids).not.toContain(blogToDelete.id)
})

describe('updating existing note', () => {
	test('updates number of likes for existing blog post', async () => {
		const blogAtStart = await helper.blogsInDb()
		const blogToUpdate = blogAtStart[0]

		await api.put(`/api/blogs/${blogToUpdate.id}`).expect(200)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
	})
}, 100000)

afterAll(() => {
	mongoose.connection.close()
})

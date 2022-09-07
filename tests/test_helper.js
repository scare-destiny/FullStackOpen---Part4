const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{title: 'teeest1', author: 'king', url: 'hmm', likes: 20},
	{title: 'teeest2', author: 'king', url: 'hmm', likes: 20},
	{title: 'teeest3', author: 'king', url: 'hmm', likes: 20},
]

const initialUsers = [
	{
		username: 'zhenka',
		name: 'Superuser',
		blogs: [],
		id: '63159ea437c978d48f7c0cc9',
	},
	{
		username: 'bro',
		name: 'Superuser',
		blogs: [],
		id: '63159ea437c978d48f7c0cc9',
	},
	{
		username: 'deniska',
		name: 'Superuser',
		blogs: [],
		id: '63159ea437c978d48f7c0cc9',
	},
]

const nonExistingId = async () => {
	const blog = new Blog({title: 'hugh', author: 'brr', url: 'N/A', likes: 1})

	await blog.save()
	await blog.remove()

	return blog._id.toString
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map((user) => user.toJSON())
}

module.exports = {
	initialBlogs,
	nonExistingId,
	blogsInDb,
	initialUsers,
	usersInDb
}

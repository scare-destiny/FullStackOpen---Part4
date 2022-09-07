const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs')
	response.json(users)
})

usersRouter.post('/', async (request, response) => {
	const {username, name, password} = request.body

	const existingUser = await User.findOne({username})

	const validateLength = (string) => {
		return string.length >= 3 ? true : false
	}

	if (!username) {
		return response.status(400).json({
			error: 'username must be given',
		})
	}

	if (!password) {
		return response.status(400).json({
			error: 'password must be given',
		})
	}

	if (existingUser) {
		return response.status(400).json({
			error: 'username must be unique',
		})
	}

	if (!validateLength(username) ) {
		return response.status(400).json({
			error: 'username must be at least 3 characters long',
		})
	}


	if (!validateLength(password) ) {
		return response.status(400).json({
			error: 'password must be at least 3 characters long',
		})
	}


	const saltRounds = 10
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const user = new User({
		username,
		name,
		passwordHash,
	})

	const savedUser = await user.save()

	response.status(201).json(savedUser)
})

module.exports = usersRouter

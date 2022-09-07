const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
	await User.deleteMany({})

	const userObjects = helper.initialUsers.map((user) => new User(user))
	const promiseArray = userObjects.map((user) => user.save())
	await Promise.all(promiseArray)
})

describe('addition of a new user', () => {
	test('succeeds with valid data', async () => {
		const newUser = {
			username: 'piska',
			name: 'bbb',
			password: '1134dd',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		
		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

		const usernames = usersAtEnd.map((b) => b.username)
		expect(usernames).toContain('piska')
		console.log(usersAtEnd)
	})

	test('fails with status code 400 if user data invalid', async () => {
		const newUser = {
			password: '1133r2r32',
			name: '32432'
		}

		await api.post('/api/users').send(newUser).expect(400)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
	})
}, 100000)

afterAll(() => {
	mongoose.connection.close()
})

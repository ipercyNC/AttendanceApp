const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const app = require('../app');
const api = supertest(app);

const User = require('../models/user');
const Student = require('../models/student');

describe('One user in DB', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('password', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();
	});

	test('Success -- Create user with new username', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'testuser',
			name:'Test User',
			password: 'secretpassword'
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map(u => u.username);
		expect(usernames).toContain(newUser.username);
	});

	test('Fail -- Create user with username the is already in DB', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen'
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('`username` to be unique');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});

	test('Users are returned as JSON', async () => {
		await api
			.get('/api/users')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('All  are returned', async () => {
		const response = await api.get('/api/users');

		expect(response.body).toHaveLength(1);
	});
});

describe('User lists students properly', () => {
	beforeEach(async () => {
		await User.deleteMany({});
		await Student.deleteMany({});

		const passwordHash = await bcrypt.hash('password', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();
	});

	test('Success -- Create user with new username', async () => {
		const usersAtStart = await helper.usersInDb();

		const currentUsername = usersAtStart[0].username;
		const currentUser = await User
			.find({ username: currentUsername });
		const currentUserId = currentUser[0]._id;

		const newStudent = {
			name: 'Michael Scott',
			transport: 'Car',
			userId: currentUserId
		};

		await api
			.post('/api/students')
			.send(newStudent)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);

		const studentsAtEnd = await helper.studentsInDb();
		expect(studentsAtEnd).toHaveLength(1);

		const usersWithStudents = studentsAtEnd.map(u => u.user);
		expect(usersWithStudents).toContainEqual(currentUserId);
	});

});


afterAll(() => {
	mongoose.connection.close();
});
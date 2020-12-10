const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const app = require('../app');
const api = supertest(app);

const Student = require('../models/student');
const User = require('../models/user');

beforeEach(async() => {
	await Student.deleteMany({});

	const studentObjects = helper.initialStudents
		.map(student => new Student(student));

	const promiseArray = studentObjects.map(student => student.save());
	await Promise.all(promiseArray);
});

describe('State: Students initially saved -> ', () => {
	test('Students are returned as JSON', async () => {
		await api
			.get('/api/students')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('All Students are returned', async () => {
		const response = await api.get('/api/students');

		expect(response.body).toHaveLength(helper.initialStudents.length);
	});

	test('A specific Student is within the returned Students', async () => {
		const response = await api.get('/api/students');

		const names = response.body.map(s => s.name);
		expect(names).toContain('Abraham Lincoln');
	});
});

describe('Viewing a specific Student', () => {
	test('Succeeds with a valid id', async () => {
		const studentsAtStart = await helper.studentsInDb();
		const studentToView = studentsAtStart[0];

		const resultStudent = await api
			.get(`/api/students/${studentToView.id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);
		const processedStudentToView = JSON.parse(JSON.stringify(studentToView));

		expect(resultStudent.body).toEqual(processedStudentToView);
	});

	test('Fails with 404 if Student does not exist', async () => {
		const validNonexistingId = await helper.nonExistingId();

		console.log('Valid non-existing ID : ', validNonexistingId);

		await api
			.get(`/api/students/${validNonexistingId}`)
			.expect(404);

	});

	test('Fails with 400 if id is invalid', async () => {
		const invalidId = '5a353d33ad32d3';

		await api
			.get(`/api/students/${invalidId}`)
			.expect(400);
	});
});

describe('Addition of a new Student', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('password', 10);
		const user = new User({ username: 'root', passwordHash });

		await user.save();
	});
	test('Succeeds with valid data', async () => {
		const loginUser = {
			'username': 'root',
			'password': 'password'
		};

		const loginResult = await api
			.post('/api/login')
			.send(loginUser)
			.expect(200);

		const tokenString = `bearer ${loginResult.body.token}`;
		const newStudent = {
			name: 'Michael Scott',
			transport: 'Car'
		};

		await api
			.post('/api/students')
			.send(newStudent)
			.set( { Authorization: tokenString })
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const studentsAtEnd = await helper.studentsInDb();
		expect(studentsAtEnd).toHaveLength(helper.initialStudents.length + 1);

		const names = studentsAtEnd.map(s => s.name);
		expect(names).toContain('Michael Scott');
	});

	test('Fails with 400 if data is missing', async () => {
		const loginUser = {
			'username': 'root',
			'password': 'password'
		};

		const loginResult = await api
			.post('/api/login')
			.send(loginUser)
			.expect(200);

		const tokenString = `bearer ${loginResult.body.token}`;
		const newStudent = {
			name: 'Michael Scott'
		};

		await api
			.post('/api/students')
			.send(newStudent)
			.set( { Authorization: tokenString })
			.expect(400);

		const studentsAtEnd = await helper.studentsInDb();
		expect(studentsAtEnd).toHaveLength(helper.initialStudents.length);
	});
});

describe('Deletion of a Student', () => {
	test('Succeeds with status code 204 if ID is valid', async () => {
		const studentsAtStart = await helper.studentsInDb();
		const studentToDelete = studentsAtStart[0];

		await api
			.delete(`/api/students/${studentToDelete.id}`)
			.expect(204);

		const studentsAtEnd = await helper.studentsInDb();
		expect(studentsAtEnd).toHaveLength(
			helper.initialStudents.length - 1
		);

		const names = studentsAtEnd.map(s => s.name);
		expect(names).not.toContain(studentToDelete.name);
	});
});
afterAll(() => {
	mongoose.connection.close();
});
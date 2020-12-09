const studentsRouter = require('express').Router();
const Student = require('../models/student');
const User = require('../models/user');

studentsRouter.get('/', async (request, response) => {
	const students = await Student
		.find({}).populate('user', { username: 1, name: 1 });
	response.json(students);
});

studentsRouter.get('/:id', async (request, response) => {
	const student = await Student.findById(request.params.id);
	if(student)
		response.json(student);
	else
		response.status(404).end();
});

studentsRouter.post('/', async (request, response) => {
	const body = request.body;
	console.log(body);

	const user = await User.findById(body.userId);

	const student = new Student({
		name: body.name,
		transport: body.transport,
		user: user._id
	});
	const savedStudent = await student.save();
	user.students = user.students.concat(savedStudent._id);
	await user.save();

	response.json(savedStudent);
});

studentsRouter.delete('/:id', async (request, response) => {
	await Student.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

studentsRouter.put('/:id', (request, response, next) => {
	const body = request.body;
	const student = {
		name: body.name,
		transport: body.transport
	};

	Student.findByIdAndUpdate(request.params.id, student, { new: true })
		.then(updatedStudent => {
			response.json(updatedStudent);
		})
		.catch(error => next(error));
});

module.exports = studentsRouter;
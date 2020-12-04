const studentsRouter = require('express').Router();
const Student = require('./models/student');

studentsRouter.get('/', (request, response) => {
	Student.find({}).then(students => {
		response.json(students);
	});
});

studentsRouter.get('/:id', (request, response, next) => {
	Student.findById(request.params.id)
		.then(student => {
			if(student)
				response.json(student);
			else
				response.status(404).end();
		})
		.catch(error => next(error));
});

studentsRouter.post('/', (request, response, next) => {
	const body = request.body;

	const student = new Student({
		name: body.name,
		transport: body.transport
	});

	student.save()
		.then(savedStudent => {
			response.json(savedStudent);
		})
		.catch(error=> next(error));
});

studentsRouter.delete('/:id', (request, response, next) => {
	Student.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch(error => next(error));
});

studentsRouter.put('/:id', (request, response, next) => {
	const body = request.body;
	const student = {
		name: body.name,
		transport: body.transport
	};

	Student.findByIdandUpdate(request.params.id, student, { new: true })
		.then(updatedStudent => {
			response.json(updatedStudent);
		})
		.catch(error => next(error));
});

module.exports = studentsRouter;
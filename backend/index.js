const app = require('./app');
const http = require('http');
const config = require('./utils/config.js');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
	logger.info(`Server running on port ${config.PORT}`);
});

/*require('dotenv').config();
const { response } = require('express');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const Student = require('./models/student');


const requestLogger = (request, response, next) => {
	console.log('Method: ', request.method);
	console.log('Path: ', request.path);
	console.log('Body: ', request.body);
	console.log('----');
	next();
};

app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);
app.use(express.static('build'));


//Get all students
app.get('/api/students', (request, response) => {
	Student.find({}).then(students => {
		response.json(students);
	});
});


//GET student by ID
app.get('/api/students/:id', (request, response, next) => {
	Student.findById(request.params.id)
		.then(student => {
			if(student){
				response.json(student);
			} else{
				response.status(404).end();
			}
		})
		.catch(error => next(error));
});


//DELETE student by ID
app.delete('/api/students/:id', (request, response, next) => {
	Student.findByIdRemove(request.params.id)
		.then(result => {
			response.status(204).end();
		})
		.catch(error => {
			next(error);
		});
});


//POST student
app.post('/api/students', (request, response, next) => {
	const body = request.body;

	if(!body.name) {
		return response.status(400).json({
			error: 'Name Missing'
		});
	}

	const student = new Student({
		name: body.name,
		transport: body.transport
	});

	student.save()
		.then(savedStudent => savedStudent.toJSON())
		.then(savedAndFormattedStudent =>
			response.json(savedAndFormattedStudent))
		.catch(error => next(error));
});


app.put('/api/students/:id', (request, response,next) => {
	console.log('here');
	const body = request.body;
	const student = {
		name: body.name,
		transport: body.transport
	};

	console.log('backend ',body);
	Student.findByIdAndUpdate(request.params.id, student, { new: true} )
		.then(updatedStudent => {
			response.json(updatedStudent);
		})
		.catch(error => next(error));
});


const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	if(error.name === 'CastError'){
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError'){
		return response.status(400).json({ error: error.message});
	}
	next(error);
};


app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
*/
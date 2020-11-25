require('dotenv').config();
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


//Landing page for Index/root
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

//Get all students 
app.get('/api/students', (request, response) => {
    Student.find({}).then(students => {
        response.json(students);
    });
});

//GET student by ID
app.get('/api/students/:id', (request, response) => {
    Student.findById(request.params.id)
    .then(student => {
        if(student){
            response.json(student);
        } else{
            response.status(404).end();
        }
    })
    .catch(error => {
        console.log(error);
        response.status(500).end();
    });
});

//DELETE student by ID
app.delete('/api/students/:id', (request, response) => {
   Student.findByIdRemove(request.params.id)
    .then(result => {
        response.status(240).end();
    })
    .catch(error => {
        next(error);
    });
});

//Generate ID to be used with POST student


//POST student
app.post('/api/students', (request, response) => {
    const body = request.body;

    if(!body.name) {
        return response.status(400).json({
            error: 'Name Missing'
        });
    }

    const student = new Student({
        name: body.name,
        transport: Math.random() > 0.5? 'Car':'Bus'
    });

    student.save().then(savedStudent => {
        response.json(savedStudent);
    })
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

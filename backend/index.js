const { response } = require('express');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
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

let students = [
    {
        id: 1,
        name: 'John Smith',
        transport: 'Car'
    },
    {
        id: 2,
        name: 'Jane Smith',
        transport: 'Car'
    },
    {
        id: 3,
        name: 'Jake Smith',
        transport: 'Bus'
    }
];

//Landing page for Index/root
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

//Get all students 
app.get('/api/students', (request, response) => {
    response.json(students);
});

//GET student by ID
app.get('/api/students/:id', (request, response) => {
    const id = Number(request.params.id);
    const student = students.find(student => student.id === id);
    if(student)
        response.json(student);
    else
        response.status(404).end();
});

//DELETE student by ID
app.delete('/api/students/:id', (request, response) => {
    const id = Number(request.params.id);
    students = students.filter(student => student.id !== id);
    response.status(204).end();
});

//Generate ID to be used with POST student
const generateID = () => {
    const maxId = students.length > 0 ?
        Math.max(...students.map(n=>n.id))
        : 0
    return maxId + 1;
};

//POST student
app.post('/api/students', (request, response) => {
    const body = request.body;

    if(!body.name) {
        return response.status(400).json({
            error: 'Name Missing'
        });
    }

    const student = {
        id: generateID(),
        name: body.name,
        transport: body.transport
    };

    students = students.concat(student);

    response.json(student);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const { response } = require('express');
const express = require('express');
const app = express();


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
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});
app.get('/api/students', (request, response) => {
    response.json(students);
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

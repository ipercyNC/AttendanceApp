import React from 'react';

const Student = ({ student }) => {
    return (
        <li className='student'>{student.name} {student.transport}</li>

    );
};

export default Student;
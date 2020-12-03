import React from 'react';

const Student = ({ student, toggleTransport }) => {
    const transportType = student.transport === 'Car'? 'Change to Bus': 'Change to Car' 
    return (
        <li className='student'>
            <p>  
                Name: {student.name} <br/>
                Transport Type: {student.transport} 
                <button onClick={toggleTransport}>{transportType}</button>
            </p>
          </li>

    );
};

export default Student;
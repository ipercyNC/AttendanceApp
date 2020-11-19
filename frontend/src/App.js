import React from 'react';
import Student from './components/Student';

const App = ({students}) => {
  return(
    <div>
      <h1>Students</h1>
      <ul>
        {students.map((student) => 
          <Student key={student.id} student={student} />
        )}
      </ul>
    </div>
  )
};
export default App;
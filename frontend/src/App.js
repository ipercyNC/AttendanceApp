import React, {useState, useEffect} from 'react';
import Student from './components/Student';
import studentService from './services/students';
import Notification from './components/Notification';
const App = (props) => {
  const [students,setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState('Add Student...');
  const [showCars, setShowCars] = useState(false);
  const [showBusses, setShowBusses] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    console.log('effect');
    studentService
      .getAll()
      .then(initialStudents => {
        setStudents(initialStudents);
      })
      .catch(error => 
        console.log(error));
  }, []);

  console.log('render', students.length, 'students')

  const addStudent = (event) => {
    event.preventDefault();
    const studentObject = {
      name: newStudent,
      transport: Math.random() < 0.5? 'Car': 'Bus'
    };
    studentService
      .create(studentObject)
      .then(returnedStudent => {
        setStudents(students.concat(returnedStudent));
        setNewStudent('');
        setSuccessMessage(
          `Student '${returnedStudent.name}' was added`
        );
        setTimeout(() => {
          setSuccessMessage(null);
        }, 4000);
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  const handleStudentChange = (event) => {
    setNewStudent(event.target.value);
  };

  const studentsToShow = !showCars && !showBusses 
    ? students
      : !showCars
        ?  students.filter(student => student.transport ==='Bus')
          :students.filter(student => student.transport ==='Car');
  return (
    <div>
      <h1>Students</h1>
      <Notification message={successMessage} />
      <div>
        <button onClick={() => { setShowCars(true); setShowBusses(false);}}>
          Show Cars 
        </button>
        <button onClick={() => { setShowBusses(true); setShowCars(false); }}>
          Show Busses
        </button>
        <button onClick={() => {setShowBusses(false); setShowCars(false); }}>
          Show All
        </button>
      </div>
      <ul>
        {studentsToShow.map(student => 
          <Student key={student.id} student={student} />
        )}
      </ul>
      <form onSubmit={addStudent}>
        <input value ={newStudent} onChange={handleStudentChange}/>
        <button type="submit">Save</button>
      </form>
    </div>
  )
};

export default App;
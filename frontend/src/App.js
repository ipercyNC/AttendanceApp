import React, {useState, useEffect} from 'react';
import Student from './components/Student';
import studentService from './services/students';
import Notification from './components/Notification';
const App = (props) => {
  const [students,setStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentTransport, setStudentTransport] = useState('');
  const [showCars, setShowCars] = useState(false);
  const [showBusses, setShowBusses] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

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
      name: studentName,
      transport: studentTransport
    };
    studentService
      .create(studentObject)
      .then(returnedStudent => {
        setStudents(students.concat(returnedStudent));
        setStudentName('');
        setStudentTransport('');
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
  
  const handleNameChange = event => {
    setStudentName(event.target.value);
  };

  const handleTransportChange = event => {
    setStudentTransport(event.target.value);
  }

  const toggleTransportType = id => {
    const student = students.find(s => s.id === id);
    const changedStudent = 
      { ...student, 
        transport: student.transport === 'Car'? 'Bus': 'Car'
      };
      console.log("changed student " , changedStudent)
    studentService
      .update(id, changedStudent)
      .then(returnedStudent => {
        setStudents(students.map(student => student.id !== id ? student: returnedStudent));
      })
      .catch(error => {
        console.log(error);
        alert(`The student '${student.name}' was already deleted from the server`);

        setStudents(students.filter(s => s.id !==id));
      });
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
          <Student 
            key={student.id} 
            student={student} 
            toggleTransport={() => toggleTransportType(student.id)} 
          />
        )}
      </ul>
      <form onSubmit={addStudent}>
        Add New Student: 
        <input value ={studentName} onChange={handleNameChange} placeholder="Student Name"/>
        <input value ={studentTransport} onChange={handleTransportChange} placeholder="Car/Bus"/>
        <button type="submit">Save</button>
      </form>
    </div>
  )
};

export default App;
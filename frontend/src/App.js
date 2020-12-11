import React, { useState, useEffect, useRef } from 'react';
import Student from './components/Student';
import studentService from './services/students';
import loginService from './services/login';
import SuccessNotification from './components/SuccessNotification';
import ErrorNotification from './components/ErrorNotification';
import LoginForm from './components/LoginForm';
import Togglable from './components/Togglable';
import StudentForm from './components/StudentForm';

const App = () => {
	const [students,setStudents] = useState([]);
	const [showCars, setShowCars] = useState(false);
	const [showBusses, setShowBusses] = useState(false);
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [user, setUser] = useState(null);
	const studentFormRef = useRef();

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

	useEffect(() => {
		const loggedInUser = window.localStorage.getItem('loggedInUser');
		if (loggedInUser) {
			const user = JSON.parse(loggedInUser);
			setUser(user);
			studentService.setToken(user.token);
		}
	}, []);

	const addStudent = (studentObject) => {
		studentFormRef.current.toggleVisibility();
		studentService
			.create(studentObject)
			.then(returnedStudent => {
				setStudents(students.concat(returnedStudent));
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

	const handleLogin = async userObject => {
		try{
			const user = await loginService.login(
				userObject
			);
			window.localStorage.setItem(
				'loggedInUser', JSON.stringify(user)
			);
			studentService.setToken(user.token);
			setUser(user);
		}catch (exception) {
			setErrorMessage('Wrong Credentials');
			setTimeout(() => {
				setErrorMessage(null);
			}, 5000);
		}
	};

	const toggleTransportType = id => {
		const student = students.find(s => s.id === id);
		const changedStudent = { ...student, transport: student.transport === 'Car'? 'Bus': 'Car' };
		console.log('changed student ' , changedStudent);
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


	const loginForm = () => (
		<Togglable buttonLabel="Login">
			<LoginForm login={handleLogin} />
		</Togglable>

	);

	const studentForm = () => (
		<Togglable buttonLabel="new student" ref={studentFormRef}>
			<StudentForm createStudent={addStudent}  />
		</Togglable>
	);

	return (
		<div>
			<h1>Students</h1>
			<SuccessNotification message={successMessage} />
			<ErrorNotification message={errorMessage} />
			{user === null ?
				loginForm():
				<div>
					<p>{user.name} logged-in</p>
					{studentForm()}
				</div>
			}
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

		</div>
	);
};

export default App;
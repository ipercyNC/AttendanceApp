import React, { useState } from 'react';
import PropTypes from 'prop-types';

const StudentForm = ({ createStudent }) => {
	const [newStudentName, setNewStudentName] = useState('');
	const [newStudentTransport, setNewStudentTransport] = useState('');

	const handleNameChange = event => {
		setNewStudentName(event.target.value);
	};

	const handleTransportChange = event => {
		setNewStudentTransport(event.target.value);
	};

	const addStudent = event => {
		event.preventDefault();
		createStudent({
			name: newStudentName,
			transport: newStudentTransport
		});
		setNewStudentTransport('');
		setNewStudentName('');
	};

	return (
		<div className='studentFormDiv'>
			<h2>Create a new Student</h2>
			<form onSubmit={addStudent}>
			Add New Student:
				<input className='studentNameInput' value ={newStudentName} onChange={handleNameChange} placeholder="Student Name"/>
				<input className='studentTransportInput' value ={newStudentTransport} onChange={handleTransportChange} placeholder="Car/Bus"/>
				<button type="submit">Save</button>
			</form>
		</div>

	);

};

StudentForm.propTypes = {
	createStudent: PropTypes.func.isRequired
};

export default StudentForm;


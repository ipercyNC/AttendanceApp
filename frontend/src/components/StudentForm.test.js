import React from 'react';
import { render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import StudentForm from './StudentForm';

test('<StudentForm /> updates parent state and calls onSubmit', () => {
	const createStudent = jest.fn();
	const component = render(
		<StudentForm createStudent={createStudent} />
	);

	const nameInput = component.container.querySelector('.studentNameInput');
	const transportInput = component.container.querySelector('.studentTransportInput');
	const form = component.container.querySelector('form');

	fireEvent.change(nameInput, {
		target: { value: 'Test Student' }
	});
	fireEvent.change(transportInput, {
		target: { value: 'Car' }
	});
	fireEvent.submit(form);

	expect(createStudent.mock.calls).toHaveLength(1);
	expect(createStudent.mock.calls[0][0]).toHaveProperty('name','Test Student');
	expect(createStudent.mock.calls[0][0]).toHaveProperty('transport','Car');
	console.log(createStudent.mock.calls);
});
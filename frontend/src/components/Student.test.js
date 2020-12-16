import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import Student from './Student';

test('renders content', () => {
	const student = {
		name: 'Test Student',
		transport: 'Car'
	};

	const component = render(
		<Student student={student} />
	);
	const li = component.container.querySelector('li');

	console.log(prettyDOM(li));
});

test('Clicking the button calls event handler', () => {
	const student = {
		name: 'Test Student',
		transport: 'Car'
	};
	const mockHandler = jest.fn();

	const component = render(
		<Student student={student} toggleTransport={mockHandler} />
	);

	const button = component.getByText('Change to Bus');
	fireEvent.click(button);

	expect(mockHandler.mock.calls).toHaveLength(1);
});
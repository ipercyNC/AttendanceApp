import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Togglable from './Togglable';
import { hasUncaughtExceptionCaptureCallback } from 'process';

describe('<Togglable />', () => {
	let component;

	beforeEach(() => {
		component = render(
			<Togglable buttonLabel="show...">
				<div className ="testDiv" />
			</Togglable>
		);
	});

	test('Renders children properly', () => {
		expect(component.container.querySelector('.testDiv')).toBeDefined();
	});

	test('At the start, children are not displayed', () => {
		const div = component.container.querySelector('.togglableContent');

		expect(div).toHaveStyle('display: none');
	});

	test('After clicking the button, children are displayed', () => {
		const button = component.getByText('show...');
		fireEvent.click(button);

		const div = component.container.querySelector('.togglableContent');
		expect(div).not.toHaveStyle('display: none');
	});

	test('Toggled content can be closed', () => {
		const button = component.getByText('show...');
		fireEvent.click(button);

		const closeButton = component.getByText('Cancel');
		fireEvent.click(closeButton);

		const div = component.container.querySelector('.togglableContent');
		expect(div).toHaveStyle('display: none');
	});
});
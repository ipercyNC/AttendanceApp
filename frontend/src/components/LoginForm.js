import React, { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ login }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handlePasswordChange = event => {
		setPassword(event.target.value);
	};

	const handleUsernameChange = event => {
		setUsername(event.target.value);
	};
	const handleLogin = event => {
		event.preventDefault();
		login({
			username:username,
			password: password
		});
	};
	return (
		<div>
			<h2>Login</h2>

			<form onSubmit={handleLogin}>
				<div>
					username
					<input
						value={username}
						onChange={handleUsernameChange}
					/>
				</div>
				<div>
					password
					<input
						type="password"
						value={password}
						onChange={handlePasswordChange}
					/>
				</div>
				<button type="submit">Login</button>
			</form>
		</div>
	);
};
LoginForm.propTypes = {
	login: PropTypes.func.isRequired
};
export default LoginForm;
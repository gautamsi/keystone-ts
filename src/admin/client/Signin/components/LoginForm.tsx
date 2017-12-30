/**
 * The login form of the signin screen
 */

import * as React from 'react';
import { Button, Form, FormField, FormInput } from 'elemental';

export const LoginForm = ({
	email,
	handleInputChange,
	handleSubmit,
	isAnimating,
	password,
}) => {
	return (
		<div className="auth-box__col">
			<Form onSubmit={handleSubmit} noValidate>
				<FormField label="Email" htmlFor="email">
					<FormInput
						autoFocus
						type="email"
						name="email"
						onChange={handleInputChange}
						value={email}
					/>
				</FormField>
				<FormField label="Password" htmlFor="password">
					<FormInput
						type="password"
						name="password"
						onChange={handleInputChange}
						value={password}
					/>
				</FormField>
				<Button disabled={isAnimating} color="primary" type="submit">
					Sign In
				</Button>
			</Form>
		</div>
	);
};

LoginForm['propTypes'] = {
	email: React.PropTypes.string,
	handleInputChange: React.PropTypes.func.isRequired,
	handleSubmit: React.PropTypes.func.isRequired,
	isAnimating: React.PropTypes.bool,
	password: React.PropTypes.string,
};

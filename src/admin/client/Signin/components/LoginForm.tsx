/**
 * The login form of the signin screen
 */

import * as React from 'react';
import { Button, Form, FormField, FormInput } from '../../App/elemental';

export const LoginForm: React.SFC<Props> = ({
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

export interface Props {
    email?: string;
    handleInputChange?: any;
    handleSubmit?: any;
    isAnimating?: boolean;
    password?: string;
}

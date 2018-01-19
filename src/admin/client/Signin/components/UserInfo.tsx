import * as React from 'react';
import { Button } from '../../App/elemental';

// TODO Figure out if we should change "Keystone" to "Admin area"

export const UserInfo: React.SFC<Props> = ({
	adminPath,
    signoutPath,
    userCanAccessKeystone,
    userName,
}) => {
    const adminButton = userCanAccessKeystone ? (
        <Button href={adminPath} color="primary">
            Open Keystone
		</Button>
    ) : null;

    return (
        <div className="auth-box__col">
            <p>Hi {userName},</p>
            <p>You're already signed in.</p>
            {adminButton}
            <Button href={signoutPath} variant="link" color="cancel">
                Sign Out
			</Button>
        </div>
    );
};

export interface Props {
    adminPath: string;
    signoutPath: string;
    userCanAccessKeystone?: boolean;
    userName: string;
}

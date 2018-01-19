import * as React from 'react';
import { css } from 'glamor';
import { theme } from '../../../theme';

export const ModalBody: React.SFC<any> = ({
	className,
    ...props
}) => {
    return (
        <div
            className={css(classes.body, className)}
            {...props}
        />
    );
};

const classes = {
    body: {
        paddingBottom: theme.modal.padding.body.vertical,
        paddingLeft: theme.modal.padding.body.horizontal,
        paddingRight: theme.modal.padding.body.horizontal,
        paddingTop: theme.modal.padding.body.vertical,
    },
};

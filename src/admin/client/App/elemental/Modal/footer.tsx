import * as React from 'react';
import { css } from 'glamor';
import { theme } from '../../../theme';

export const ModalFooter: React.SFC<Props> = ({
	align,
    className,
    ...props
}) => {
    return (
        <div {...props} className={`${css(classes.footer, classes['align__' + align], className)}`} />
    );
};

export interface Props {
    align?: 'center' | 'left' | 'right';
    children?: any;
    onClose?: Function;
    showCloseButton?: boolean;
    text?: string;
    className?: any;
}

ModalFooter.defaultProps = {
    align: 'left',
};

const classes = {
    footer: {
        borderTop: `2px solid ${theme.color.gray10}`,
        display: 'flex',
        paddingBottom: theme.modal.padding.footer.vertical,
        paddingLeft: theme.modal.padding.footer.horizontal,
        paddingRight: theme.modal.padding.footer.horizontal,
        paddingTop: theme.modal.padding.footer.vertical,
    },

    // alignment
    align__left: {
        justifyContent: 'flex-start',
    },
    align__center: {
        justifyContent: 'center',
    },
    align__right: {
        justifyContent: 'flex-end',
    },
};

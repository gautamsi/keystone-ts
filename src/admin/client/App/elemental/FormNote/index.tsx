import * as React from 'react';
import { css } from 'glamor';
import classes from './styles';

export const FormNote: React.SFC<Props> = ({
	className,
    children,
    component: Component,
    html,
    ...props
}) => {
    props['className'] = css(classes.note, className as any);

    // Property Violation
    if (children && html) {
        console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
    }

    return html ? (
        <Component {...props} dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
            <Component {...props}>{children}</Component>
        );
};

FormNote.defaultProps = {
    component: 'div',
};
export interface Props extends React.HTMLAttributes<any> {
    component?: any;
    html?: string;
    note?: any;
}

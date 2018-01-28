import { css } from 'glamor';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import classes from './styles';

export class Form extends React.Component<Props> {
    static get defaultProps() {
        return {
            component: 'form',
            layout: 'basic',
        };
    }
    static childContextTypes = {
        formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
        labelWidth: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
    };

    getChildContext() {
        return {
            formLayout: this.props.layout,
            labelWidth: this.props.labelWidth,
        };
    }
    render() {
        // NOTE `labelWidth` is declared to remove it from `props`, though never used
        const {
			className,
            component: Component,
            labelWidth, // eslint-disable-line no-unused-vars
            layout,
            ...props
		} = this.props;

        props['className'] = css(
            classes.Form,
            classes['Form__' + layout],
            className
        );

        return <Component {...props} />;
    }
}

export interface Props {
    children: any;
    component?: any;
    layout?: 'basic' | 'horizontal' | 'inline';
    labelWidth?: any;
    className?: any;
    onSubmit?: any;
    variant?: any;
    noValidate?: any;
    action?: any;
}

import { css } from 'glamor';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import classes from './styles';
import { FormLabel } from '../FormLabel';

export class FormField extends React.Component<Props> {
    static contextTypes = {
        formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
        labelWidth: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
    };
    static childContextTypes = {
        formFieldId: PropTypes.string,
    };

    formFieldId: string;
    constructor(props) {
        super(props);
        this.formFieldId = generateId();
    }
    getChildContext() {
        return {
            formFieldId: this.formFieldId,
        };
    }
    render() {
        const { formLayout = 'basic', labelWidth } = this.context;
        let {
			cssStyles,
            children,
            className,
            cropLabel,
            htmlFor,
            label,
            offsetAbsentLabel,
            ...props
		} = this.props;

        props['className'] = css(
            classes.FormField,
            classes['FormField--form-layout-' + formLayout],
            offsetAbsentLabel ? classes['FormField--offset-absent-label'] : null,
            cssStyles
        );
        if (className) {
            props['className'] += (' ' + className);
        }
        if (offsetAbsentLabel && labelWidth) {
            // @ts-ignore
            props.style = {
                paddingLeft: labelWidth,
                ...props.style,
            };
        }

        // elements
        const componentLabel = label ? (
            <FormLabel htmlFor={htmlFor} cropText={cropLabel}>
                {label}
            </FormLabel>
        ) : null;

        return (
            // @ts-ignore
            <div {...props} htmlFor={htmlFor}>
                {componentLabel}
                {children}
            </div>
        );
    }
}

// const stylesShape = {
// 	_definition: PropTypes.object,
// 	_name: PropTypes.string,
// };

export interface Props extends React.HTMLAttributes<any> {
    children?: any;
    cropLabel?: boolean;
    cssStyles?: any;
    // PropTypes.oneOfType([
    // 	PropTypes.arrayOf(PropTypes.shape(stylesShape)),
    // 	PropTypes.shape(stylesShape),
    // ]),
    htmlFor?: string;
    label?: string;
    offsetAbsentLabel?: boolean;
    className?: any;
}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

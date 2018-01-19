import { css } from 'glamor';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import classes from './styles';

export const FormLabel: React.SFC<Props> = ({
	cssStyles,
    className,
    component: Component,
    cropText,
    htmlFor,
    ...props
},
    {
	formFieldId,
        formLayout,
        labelWidth,
}) => {
    props['htmlFor'] = htmlFor || formFieldId;
    props['className'] = css(
        classes.FormLabel,
        formLayout ? classes['FormLabel--form-layout-' + formLayout] : null,
        cropText ? classes['FormLabel--crop-text'] : null,
        cssStyles
    );
    if (className) {
        props['className'] += (' ' + className);
    }
    if (labelWidth) {
        props.style = {
            width: labelWidth,
            ...props.style,
        };
    }

    return <Component {...props} />;
};

const stylesShape = {
    _definition: PropTypes.object,
    _name: PropTypes.string,
};

FormLabel.defaultProps = {
    component: 'label',
};
FormLabel.contextTypes = {
    formLayout: PropTypes.oneOf(['basic', 'horizontal', 'inline']),
    formFieldId: PropTypes.string,
    labelWidth: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};

export interface Props {
    component?: any;
    cropText?: boolean;
    cssStyles?: any;
    // PropTypes.oneOfType([
    // 	PropTypes.arrayOf(PropTypes.shape(stylesShape)),
    // 	PropTypes.shape(stylesShape),
    // ]),
    className?: any;
    htmlFor?: any;
    style?: any;
}

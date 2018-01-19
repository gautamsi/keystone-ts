import * as React from 'react';
import { css } from 'glamor';
import classes from './styles';
import { ScreenReaderOnly } from '../ScreenReaderOnly';
import colors from './colors';
import sizes from './sizes';

export const Spinner: React.SFC<Props> = ({ className, size, color, ...props }) => {
    props['className'] = css(
        classes.base,
        classes[size],
        className
    );

    return (
        <div {...props}>
            <span className={`${css(classes.dot, classes['size__' + size], classes['color__' + color], classes.dot__first)}`} />
            <span className={`${css(classes.dot, classes['size__' + size], classes['color__' + color], classes.dot__second)}`} />
            <span className={`${css(classes.dot, classes['size__' + size], classes['color__' + color], classes.dot__third)}`} />
            <ScreenReaderOnly>Loading...</ScreenReaderOnly>
        </div>
    );
};

export interface Props {
    color?: 'danger' | 'default' | 'inverted' | 'primary' | 'success' | 'warning';
    size?: 'small' | 'medium' | 'large';
    className?: any;
}

Spinner.defaultProps = {
    size: 'medium',
    color: 'default',
};

import * as React from 'react';
import { FormInput } from '../../admin/client/App/elemental';
import { fade } from '../../admin/client/utils/color';
import { theme } from '../../admin/client/theme';

export const FileChangeMessage: React.SFC<Props> = ({ style, color, ...props }) => {
    const styles = {
        marginRight: 10,
        minWidth: 0,
        ...style,
    };

    if (color !== 'default') {
        styles.backgroundColor = fade(theme.color[color], 10);
        styles.borderColor = fade(theme.color[color], 30);
        styles.color = theme.color[color];
    }

    return (
        <FormInput
            noedit
            style={styles}
            {...props}
        />
    );
};

export interface Props {
    color?: 'danger' | 'default' | 'success';
    style?: any;
    component?: any;
    href?: any;
    target?: any;
}
FileChangeMessage.defaultProps = {
    color: 'default',
};

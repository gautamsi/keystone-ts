import * as React from 'react';
import { FormInput } from 'elemental';
import { fade } from '../../admin/client/utils/color';
import { theme } from '../../admin/client/theme';

export function FileChangeMessage({ style, color, ...props }) {
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
}

FileChangeMessage['propTypes'] = {
    color: React.PropTypes.oneOf(['danger', 'default', 'success']),
};
FileChangeMessage['defaultProps'] = {
    color: 'default',
};

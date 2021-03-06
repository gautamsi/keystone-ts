import * as React from 'react';
import { css } from 'glamor';

export const ScreenReaderOnly: React.SFC<{ className?: any }> = ({ className, ...props }) => {
    props['className'] = css(classes.srOnly, className);

    return <span {...props} />;
};

const classes = {
    srOnly: {
        border: 0,
        clip: 'rect(0,0,0,0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        width: 1,
    },
};

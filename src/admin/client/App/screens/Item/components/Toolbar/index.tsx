import * as React from 'react';
import { PropTypes } from 'react';

export const Toolbar = (props) => <div {...props} className="Toolbar" />;

Toolbar['displayName'] = 'Toolbar';
Toolbar['propTypes'] = {
    children: PropTypes.node.isRequired,
};

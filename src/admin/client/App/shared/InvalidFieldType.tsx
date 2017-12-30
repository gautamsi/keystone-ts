/**
 * Renders an "Invalid Field Type" error
 */

import * as React from 'react';

export const InvalidFieldType = function (props) {
    return (
        <div className="alert alert-danger">
            Invalid field type <strong>{props.type}</strong> at path <strong>{props.path}</strong>
        </div>
    );
};

InvalidFieldType['propTypes'] = {
    path: React.PropTypes.string,
    type: React.PropTypes.string,
};

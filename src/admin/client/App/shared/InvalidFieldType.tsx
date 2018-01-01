/**
 * Renders an "Invalid Field Type" error
 */

import * as React from 'react';

export const InvalidFieldType: React.SFC<{ path?: string, type?: string }> = (props) => {
    return (
        <div className="alert alert-danger">
            Invalid field type <strong>{props.type}</strong> at path <strong>{props.path}</strong>
        </div>
    );
};

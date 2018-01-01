import * as React from 'react';
import { evalDependsOn } from '../../../../../../fields/utils/evalDependsOn';

export class FormHeading extends React.Component<{ options: any, content: any }> {
    static displayName: string = 'FormHeading';

    render() {
        if (!evalDependsOn(this.props.options.dependsOn, this.props.options.values)) {
            return null;
        }
        return <h3 className="form-heading">{this.props.content}</h3>;
    }
}

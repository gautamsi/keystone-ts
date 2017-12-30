import * as React from 'react';
import { getRelatedIconClass } from '../utils/getRelatedIconClass';

interface ISectionProps {
    children: JSX.Element;
    icon?: string;
    id?: string;
    label: string;

}
export class Section extends React.Component<ISectionProps> {
    render() {
        const iconClass = this.props.icon || getRelatedIconClass(this.props.id);
        return (
            <div className="dashboard-group" data-section-label={this.props.label} >
                <div className="dashboard-group__heading">
                    <span className={`dashboard-group__heading-icon ${iconClass}`} />
                    {this.props.label}
                </div>
                {this.props.children}
            </div>
        );
    }
    static propTypes = {
        children: React.PropTypes.element.isRequired,
        icon: React.PropTypes.string,
        id: React.PropTypes.string,
        label: React.PropTypes.string.isRequired,
    };
}

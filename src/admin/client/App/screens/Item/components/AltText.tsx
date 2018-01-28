import * as React from 'react';
import * as vkey from 'vkey';

export interface Props {
    component?: string | any;
    modified?: JSX.Element | string;
    modifier?: '<alt>' | '<control>' | '<meta>' | '<shift>';
    normal?: JSX.Element | string;
    children?: any;
    title?: string;
    className?: string;
}
export class AltText extends React.Component<Props, any> {
    constructor(props) {
        super(props);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        this.state = {
            modified: false,
        };
    }
    componentDidMount() {
        document.body.addEventListener('keydown', this.handleKeyDown, false);
        document.body.addEventListener('keyup', this.handleKeyUp, false);
    }
    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyDown);
        document.body.removeEventListener('keyup', this.handleKeyUp);
    }
    handleKeyDown(e) {
        if (vkey[e.keyCode] !== this.props.modifier) return;
        this.setState({
            modified: true,
        });
    }
    handleKeyUp(e) {
        if (vkey[e.keyCode] !== this.props.modifier) return;
        this.setState({
            modified: false,
        });
    }
    render() {
        // NOTE `modifier` is declared to remove it from `props`, though never used
        const {
			component: Component,
            modified,
            modifier, // eslint-disable-line no-unused-vars
            normal,
            ...props
		} = this.props;

        (props as any).children = this.state.modified
            ? modified
            : normal;

        return <Component {...props} />;
    }

    static get defaultProps() {
        return {
            component: 'span',
            modifier: '<alt>',
        };
    }
}

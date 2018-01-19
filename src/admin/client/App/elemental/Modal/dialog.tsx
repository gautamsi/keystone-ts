import * as React from 'react';
import * as PropTypes from 'prop-types';

import { css } from 'glamor';
import { ScrollLock } from '../ScrollLock';
import { Portal } from '../Portal';

import { theme } from '../../../theme';

const canUseDom = !!(
    typeof window !== 'undefined'
    && window.document
    && window.document.createElement
);

export class ModalDialog extends React.Component<Props> {

    static get defaultProps() {
        return {
            enableKeyboardInput: true,
            width: 768,
        };
    }
    static childContextTypes = {
        onClose: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleBackdropClick = this.handleBackdropClick.bind(this);
        this.handleKeyboardInput = this.handleKeyboardInput.bind(this);
    }
    getChildContext() {
        return {
            onClose: this.props.onClose,
        };
    }
    componentWillReceiveProps(nextProps) {
        if (!canUseDom) return;

        // add event listeners
        if (nextProps.isOpen && nextProps.enableKeyboardInput) {
            window.addEventListener('keydown', this.handleKeyboardInput);
        }
        if (!nextProps.isOpen && nextProps.enableKeyboardInput) {
            window.removeEventListener('keydown', this.handleKeyboardInput);
        }
    }
    componentWillUnmount() {
        if (this.props.enableKeyboardInput) {
            window.removeEventListener('keydown', this.handleKeyboardInput);
        }
    }

    // ==============================
    // Methods
    // ==============================

    handleKeyboardInput = (event) => {
        if (event.keyCode === 27) this.props.onClose();

        return false;
    };
    handleBackdropClick = (e) => {
        if (e.target !== this.refs.container) return;

        this.props.onClose();
    };

    // ==============================
    // Renderers
    // ==============================

    renderDialog() {
        const {
			backdropClosesModal,
            children,
            isOpen,
            width,
		} = this.props;

        if (!isOpen) return <span key="closed" />;

        return (
            <div
                className={`${css(classes.container)}`}
                key="open"
                ref="container"
                onClick={e => !!backdropClosesModal && this.handleBackdropClick(e)}
                onTouchEnd={e => !!backdropClosesModal && this.handleBackdropClick(e)}
            >
                <div className={`${css(classes.dialog)}`} style={{ width }} data-screen-id="modal-dialog">
                    {children}
                </div>
                <ScrollLock />
            </div>
        );
    }
    render() {
        return (
            <Portal>
                {this.renderDialog()}
            </Portal>
        );
    }
}

export interface Props {
    backdropClosesModal?: boolean;
    enableKeyboardInput?: boolean;
    isOpen?: boolean;
    onClose: Function;
    width?: number;
}

const classes = {
    container: {
        alignItems: 'center',
        backgroundColor: theme.modal.background,
        boxSizing: 'border-box',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: theme.modal.zIndex,
    },
    dialog: {
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.default,
        paddingBottom: theme.modal.padding.dialog.vertical,
        paddingLeft: theme.modal.padding.dialog.horizontal,
        paddingRight: theme.modal.padding.dialog.horizontal,
        paddingTop: theme.modal.padding.dialog.vertical,
        position: 'relative',
    },
};

/**
 * Renders a confirmation dialog modal
 */

import * as React from 'react';
import { Button, ModalDialog, ModalBody, ModalFooter, ModalHeader } from '../elemental';

export const ConfirmationDialog: React.SFC<Props> = ({
	cancelLabel,
    children,
    confirmationLabel,
    confirmationType,
    html,
    isOpen,
    onCancel,
    onConfirmation,
    ...props
}) => {
    // Property Violation
    if (children && html) {
        console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
    }

    return (
        <ModalDialog
            backdropClosesModal
            isOpen={isOpen}
            onClose={onCancel}
            width={400}
        >
            {html ? (
                <ModalBody {...props} dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
                    <ModalBody {...props}>{children}</ModalBody>
                )}
            <ModalFooter>
                <Button autoFocus size="small" data-button-type="confirm" color={confirmationType} onClick={onConfirmation}>
                    {confirmationLabel}
                </Button>
                <Button size="small" data-button-type="cancel" variant="link" color="cancel" onClick={onCancel}>
                    {cancelLabel}
                </Button>
            </ModalFooter>
        </ModalDialog>
    );
};

export interface Props {
    body?: string;
    cancelLabel?: string;
    confirmationLabel?: string;
    confirmationType?: 'danger' | 'primary' | 'success' | 'warning';
    onCancel?: any;
    onConfirmation?: any;
    html?: any;
    isOpen?: boolean;
}

ConfirmationDialog.defaultProps = {
    cancelLabel: 'Cancel',
    confirmationLabel: 'Okay',
    confirmationType: 'danger',
    isOpen: false,
};

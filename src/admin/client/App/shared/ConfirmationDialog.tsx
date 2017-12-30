/**
 * Renders a confirmation dialog modal
 */

import * as React from 'react';
import { Button, Modal } from 'elemental';

export function ConfirmationDialog ({
	cancelLabel,
	children,
	confirmationLabel,
	confirmationType,
	html,
	isOpen,
	onCancel,
	onConfirmation,
	...props
}) {
	// Property Violation
	if (children && html) {
		console.error('Warning: FormNote cannot render `children` and `html`. You must provide one or the other.');
	}

	return (
		<Modal.Dialog
			backdropClosesModal
			isOpen={isOpen}
			onClose={onCancel}
			width={400}
		>
			{html ? (
				<Modal.Body {...props} dangerouslySetInnerHTML={{ __html: html }} />
			) : (
				<Modal.Body {...props}>{children}</Modal.Body>
			)}
			<Modal.Footer>
				<Button autoFocus size="small" data-button-type="confirm" color={confirmationType} onClick={onConfirmation}>
					{confirmationLabel}
				</Button>
				<Button size="small" data-button-type="cancel" variant="link" color="cancel" onClick={onCancel}>
					{cancelLabel}
				</Button>
			</Modal.Footer>
		</Modal.Dialog>
	);
}
ConfirmationDialog['propTypes'] = {
	body: React.PropTypes.string,
	cancelLabel: React.PropTypes.string,
	confirmationLabel: React.PropTypes.string,
	confirmationType: React.PropTypes.oneOf(['danger', 'primary', 'success', 'warning']),
	onCancel: React.PropTypes.func,
	onConfirmation: React.PropTypes.func,
};
ConfirmationDialog['defaultProps'] = {
	cancelLabel: 'Cancel',
	confirmationLabel: 'Okay',
	confirmationType: 'danger',
	isOpen: false,
};

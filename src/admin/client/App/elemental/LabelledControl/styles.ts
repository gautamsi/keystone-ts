// ==============================
// Alert
// ==============================

/* eslint quote-props: ["error", "as-needed"] */

import theme from '../../../theme';

export default {
	wrapper: {
		display: 'block',
		height: theme.input.height,
		lineHeight: theme.input.lineHeight,
	},
	wrapper__inline: {
		display: 'inline',
	},

	// checkbox or radio
	control: {
		marginRight: '0.5em',
	},
};

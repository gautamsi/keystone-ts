const requestLanguage = require('express-request-language');
const assign = require('object-assign');

export default function (keystone) {
	const languageOptions = assign({
		'supported languages': ['en-US'],
		'language cookie': 'language',
		'language cookie options': {},
		'language select url': '/languages/{language}',
	}, keystone.get('language options'));

	return requestLanguage({
		languages: languageOptions['supported languages'],
		cookie: {
			name: languageOptions['language cookie'],
			url: languageOptions['language select url'],
		},
		queryName: languageOptions['language query name'],
	});
}

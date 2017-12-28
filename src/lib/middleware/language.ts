import * as requestLanguage from 'express-request-language';
import * as assign from 'object-assign';

export function language(keystone) {
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

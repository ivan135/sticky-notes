module.exports = {
    "root": true,
	"parser": 'babel-eslint',
    // eslint 中文文档
    // https://eslint.cn/docs/user-guide/command-line-interface
    "extends": 'standard',
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
		"browser": true,
	},
    "plugins": [
		'html',
	],
    "rules": {
        // allow paren-less arrow functions
		'arrow-parens': 0,
		'no-tabs': 'off',
		'indent': [ 'error', 'tab', {
            'SwitchCase': 1,
			'MemberExpression': 0,
        }],
        // allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		'semi': [ 'error', 'always' ],
		'comma-dangle': [ 'error', {
			'arrays': 'only-multiline',
			'objects': 'only-multiline',
			'imports': 'only-multiline',
			'exports': 'only-multiline',
			'functions': 'ignore',
		}],
		'no-extend-native': [ 'error', { 'exceptions': [ 'String' ]}],
		'space-before-function-paren': [ 'error', {
			'anonymous': 'ignore',
			'named': 'ignore',
			'asyncArrow': 'ignore',
		}],
		'space-before-blocks': [ 'error', 'never' ],
		'keyword-spacing': [ 'error', {
			'after': true,
			'before': !true,
			'overrides': {
				'if': { 'after': !true },
				'while': { 'after': !true },
				'for': { 'after': !true },
				'else': { 'after': !true },
				'return': { 'after': true },
				'from': { 'after': true, 'before': true },
				'import': { 'after': true },
				'const': { 'after': true },
				'catch': { 'after': !true },
				'try': { 'after': !true },
				'do': { 'after': !true },
				'switch': { 'after': !true },
				'finally': { 'after': !true },
				'with': { 'after': !true },
				'break': { 'after': !true },
				'as': { 'before': true },
			},
		}],
		'brace-style': [ 'error', 'stroustrup' ],
		'spaced-comment': [ 'error', 'always' ],
		'eol-last': [ 'error', 'always' ],
		'space-infix-ops': [ 'error', { 'int32Hint': !true }],
		'camelcase': [ 'error', { 'properties': 'never' }],
		'padded-blocks': [ 'error', 'never' ],
		'no-unused-vars': [ 'error', { 'vars': 'all', 'args': 'none' }],
		'quotes': [ 'error', 'single' ],
		'no-multi-spaces': 'error',
		'comma-spacing': [ 'error', { 'before': !true, 'after': true }],
		'eqeqeq': 'error',
    }
};
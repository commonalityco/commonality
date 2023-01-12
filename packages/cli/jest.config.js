const config = {
	clearMocks: true,
	verbose: false,
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
		chalk: '<rootDir>/node_modules/chalk/source/index.js',
		'#ansi-styles':
			'<rootDir>/node_modules/chalk/source/vendor/ansi-styles/index.js',
		'#supports-color':
			'<rootDir>/node_modules/chalk/source/vendor/supports-color/index.js',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
			},
		],
	},
};

export default config;

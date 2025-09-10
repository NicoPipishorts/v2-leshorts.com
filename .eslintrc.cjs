/* eslint-env node */
module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
		ecmaFeatures: { jsx: true },
	},
	plugins: [
		"@typescript-eslint",
		"react-refresh",
		"react-hooks",
		"import",
		"unused-imports",
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended",
		"plugin:react-refresh/recommended",
		"plugin:import/recommended",
		"plugin:import/typescript",
		"prettier",
	],
	settings: {
		"import/resolver": {
			typescript: true,
		},
	},
	rules: {
		"no-console": ["warn", { allow: ["warn", "error"] }],
		"@typescript-eslint/no-unused-vars": "off",
		"unused-imports/no-unused-imports": "warn",
		"import/order": [
			"warn",
			{
				groups: [
					["builtin", "external"],
					["internal"],
					["parent", "sibling", "index"],
				],
				"newlines-between": "always",
				alphabetize: { order: "asc", caseInsensitive: true },
			},
		],
	},
	ignorePatterns: ["dist", "node_modules"],
};

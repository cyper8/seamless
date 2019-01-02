import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

export default [
	{
		input: 'src/seamless.js',
		output: {
			name: 'Seamless',
			file: 'bin/seamless-bundle.js',
			format: 'iife'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
	    // minify(),
		]
	},
	{
		input: 'src/seamless.js',
		output: {
			name: 'Seamless',
			file: 'bin/seamless-bundle.min.js',
			format: 'iife'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
	    minify(),
		]
	}
];

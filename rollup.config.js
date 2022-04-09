import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import html from '@web/rollup-plugin-html';

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
	    // terser(),
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
	    terser(),
		]
	},
	{
		input: './index.html',
		output: {
			dir: 'demo'
		},
		plugins: [
			resolve(),
			commonjs(),
			terser(),
			html(),
		]
	}
];

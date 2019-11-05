import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

module.exports = {
    input: 'src/index.js',
    external: [],
    output: [
        {
            file: 'dist/paramo.cjs.js',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
        {
            file: 'dist/paramo.esm.js',
            format: 'esm',
            sourcemap: true,
            exports: 'named',
        },
    ],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
        }),
        commonjs({
            namedExports: {},
        }),
        terser(),
    ],
};

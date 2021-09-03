const path = require('path');

module.exports = {
    context: path.resolve('src'),
    devtool: 'inline-source-map',
    entry: './entitystore.ts',
    mode: 'production',
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    output: {
        filename: 'entitystore.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'EntityStore'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
};
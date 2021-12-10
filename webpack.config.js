const path = require('path');

module.exports = {
    context: path.resolve('src'),
    devtool: 'source-map',
    entry: './main.ts',
    mode: 'development',
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
        globalObject: 'this',
        library: {
            name: "jsentitystore",
            type: "umd"
        }
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
};
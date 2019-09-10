const merge = require('webpack-merge');
const common = require('./webpack.common.js');
var path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        host: "0.0.0.0",
        port: 8080,
        proxy: {
            "/auth": {
                target: "http://proxy.narro.me/",
                secure: false,
                changeOrigin: true,
            },
            "/user": {
                target: "http://proxy.narro.me/",
                secure: false,
                changeOrigin: true,
            },
        }
    },
});
const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://157.230.240.133',
            changeOrigin: true,
        })
    );
    // app.use(
    //     '/io',
    //     createProxyMiddleware({
    //         target: 'http://backend:3000',
    //         changeOrigin: true,
    //     })
    // );
    // app.use(
    //     '/socketio',
    //     createProxyMiddleware({
    //         target: 'http://backend:3000/socketio',
    //         changeOrigin: true,
    //     })
    // );
};
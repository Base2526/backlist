const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: process.env.REACT_APP_API,// "http://backendnginx:8099",//'http://157.230.240.133',
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

    app.use(
        '/mysocket',
        createProxyMiddleware({
            target: process.env.REACT_APP_MY_SOCKET,
            changeOrigin: true,
        })
    );
};

// location /mysocket {
//     proxy_pass http://nodejs:3000; 
//     proxy_http_version 1.1;
//     proxy_set_header Upgrade $http_upgrade;
//     proxy_set_header Connection 'upgrade';
//     proxy_set_header Host $host;
//     proxy_cache_bypass $http_upgrade;
// }
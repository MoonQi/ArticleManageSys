const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api.php?',
        createProxyMiddleware({
            target: 'https://gbf.huijiwiki.com',
            changeOrigin: true,
        })
    );
};
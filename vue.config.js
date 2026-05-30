const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    host: 'localhost',
    port: 8081, // 前端开发服务器端口
    https: false,
    // 代理配置：将前端请求转发到后端Spring Boot服务器
    proxy: {
      '/login': {
        target: 'http://localhost:6024', // 后端Spring Boot服务地址（端口6024）
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/login': '' }
      },
      '/main': {
        target: 'http://localhost:6024', // 后端Spring Boot服务地址（端口6024）
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/main': '' }
      },
    }
  }
})

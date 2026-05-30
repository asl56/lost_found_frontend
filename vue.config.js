const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    host: 'localhost',
    port: 8081, // 前端开发服务器端口，避免与后端8080冲突
    https: false,
    // 代理配置：将前端请求转发到后端Spring Boot服务器
    proxy: {
      '/login': {
        target: 'http://localhost:8080', // 后端Spring Boot服务地址
        ws: true,
        changeOrigin: true, // 允许跨域（修复拼写错误：changOrigin -> changeOrigin）
        pathRewrite: {
          '^/login': '' // 请求时将 /login 前缀去掉
        }
      },
      '/main': {
        target: 'http://localhost:8080', // 后端Spring Boot服务地址
        ws: true,
        changeOrigin: true, // 允许跨域（修复拼写错误：changOrigin -> changeOrigin）
        pathRewrite: {
          '^/main': '' // 请求时将 /main 前缀去掉
        }
      },
    }
  }
})

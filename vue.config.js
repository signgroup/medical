module.exports = {
    publicPath: './',
    // 部署应用时的基本 URL
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    // 把px单位换算成rem单位
                    require("postcss-pxtorem")({
                        rootValue: 37.5, // 换算的基数(设计图750的根字体为32)
                        selectorBlackList: [".van"],// 要忽略的选择器并保留为px。
                        propList: ["*"], //可以从px更改为rem的属性。
                        minPixelValue: 2 // 设置要替换的最小像素值。
                    })
                ]
            }
        },
    },
    // 输出文件目录 vue ui build 也可配置
    outputDir: 'build',
    //放置生成的静态资源（js、css、img、fonts）的相对路径
    assetsDir: './static',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    productionSourceMap: false,//关闭js map文件
    // productionSourceMap:false,//关闭js map文件
    devServer: {
        // 在设置让浏览器 overlay 同时显示警告和错误
        /*overlay: {
            warnings: true,
            errors: true
        },*/
        /*
        *http://192.168.0.126:8011 本地
        * */
        port: 9000,
        hotOnly: true,//热更新
        proxy: {
            '/api': {
                target: 'http://192.168.0.214:8001/v1/regv1',
                changeOrigin: true,//如果需要跨域那么需要加上参数changeOrigin:true
                ws: true,
                pathRewrite: {
                    '^/api': ''// 替换target中的请求地址
                }
            }
        },
    },
}

module.exports = {
    //部署应用包时的基本 URL
    publicPath: './',
    //打包地址
    outputDir: 'build',
    //是否启用Gzip
    gzip:true,
    //版权说明
    notice: true,
    css:{
        //是否分离css
        separateCss: false,
        //压缩
        compress: false,
        //兼容处理
        postcss: true,
        //输出目录 css/
        outputPath:''
    },
    js:{
        // 生产环境是否生成 sourceMap 文件
        productionSourceMap: true,
        //压缩
        compress: true,
        //输出目录  js/
        outputPath:'',
        //开启多进程
        thread: false,
        //压缩删除console.log
        console: true
    },
    img:{
        //打包图片大小
        limit: 4 * 1024,
        //输出目录
        outputPath:'img/'
    },
    //拒绝某些包被进来
    externals:{

    },
    //插件
    plugins:[],
    //loader
    rules:[],

};
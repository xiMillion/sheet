
// resolve用来拼接绝对路径的方法
const {resolve} = require('path');
const fs = require("fs");
const webpack = require('webpack')
//生成html 加入生成的css，js
const HtmlWebpackPlugin = require('html-webpack-plugin');
//将js内css 提取为css文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 压缩css
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
//压缩 js
const TerserWebpackPlugin = require('terser-webpack-plugin');
//拷贝文件
const CopyWebpackPlugin = require('copy-webpack-plugin');
//打包gzip
const CompressionPlugin = require("compression-webpack-plugin");

const package = require('../package.json');
const envOption = require(`./env.${process.env.NODE_ENV}.json`);
const NotesWebpackPlugin = require('@xiui/webpack-plugin-notes');

//Pwa 插件


//eslint
const ESLintPlugin = require('eslint-webpack-plugin');

const setting  = require('./lib.config');

const isProduction = process.env.NODE_ENV === 'production';

// 复用loader
const commonCssLoader = [
    //这个loader取代style-loader。作用：提取js中的css成单独文件
    setting.css.separateCss ? MiniCssExtractPlugin.loader : 'style-loader',
    //'style-loader',
    'css-loader',
];

//css 兼容
if(setting.css.postcss){
    commonCssLoader.push(
        //css 兼容浏览器处理
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            "postcss-preset-env",
                            {
                                // Options
                            },
                        ],
                    ],
                }
            }
        },
    )
}

module.exports = {
    //webpack-dev-server时，无法自动刷新页面
    target: 'web',
    // 入口起点
    entry: {
        [`'${package.name}'`]: './src/index.ts',
    },
    // 输出
    output: {
        //先清理文件
        clean: true,
        // 输出路径
        // __dirname nodejs的变量，代表当前文件的目录绝对路径
        path: resolve(__dirname, '../' + setting.outputDir),
        // 输出文件名  [name]：取文件名  contenthash  更改的hash值前10位
        filename: `${setting.js.outputPath}[name].js`,
        // 所有资源引入公共路径前缀 --> 'imgs/a.jpg' --> './imgs/a.jpg'
        publicPath: setting.publicPath,
        chunkFilename: `${setting.js.outputPath}[name]_chunk.js`, // 非入口chunk的名称
        library: '[name]', // 整个库向外暴露的变量名
        // libraryTarget: 'window' // 变量名添加到哪个上 browser
        // libraryTarget: 'global' // 变量名添加到哪个上 node
        libraryTarget: 'umd',
        libraryExport:"default",
        //解决顶级还是箭头函数问题
        environment: {
            // ...
            arrowFunction: false,
            const: false,
            forOf: false,
        },
    },

    optimization: {
        minimize: true,
        minimizer: (()=>{
            const minimizer = [];
            setting.js.compress && minimizer.push(new TerserWebpackPlugin({
                terserOptions: {
                    compress: {
                        drop_console: setting.js.console,
                    },
                }
            }));
            setting.css.compress && minimizer.push(new CssMinimizerPlugin());
            setting.notice && minimizer.push(new NotesWebpackPlugin(`[name] v[version]`
                + `\n`
                + `Author: [author]`
                + `\n`
                + `Documentation: [description]`
                + `\n`
                + `License: [license]`
                + `\n`
                + `Date: ${new Date()}`
            ));
            return minimizer;
        })()
        /*
          1. 可以将node_modules中代码单独打包一个chunk最终输出
          2. 自动分析多入口chunk中，有没有公共的文件。如果有会打包成单独一个chunk
      */
        // splitChunks: {
        //   chunks: 'all'
        // }
    },
    module: {
        /*
           正常来讲，一个文件只能被一个loader处理。
          当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
        */
        rules: [
            {
                oneOf: [
                    // 详细loader配置
                    // 不同文件必须配置不同loader处理
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: (()=>{
                            const uses = [
                                {
                                    loader: 'babel-loader',
                                    
                                }
                            ];

                            if(setting.js.thread){
                                uses.unshift(
                                    {
                                        loader: 'thread-loader',
                                        options: {
                                          workers: 4
                                        }
                                    }
                                )
                            }

                            return uses;
                        })()
                    },

                    
                    {
                        test: /.tsx?$/,
                        exclude: /node_modules/,
                        use: ['ts-loader']
                    },

                    {
                        // 匹配哪些文件
                        test: /\.css$/,
                        // 使用哪些loader进行处理
                        use: [
                            ...commonCssLoader
                        ]
                    },
                    
                    
                    {
                        test: /.less$/,
                        use: [
                            ...commonCssLoader,
                            'less-loader'
                        ]
                    },
    
                    
                    {
                        // 问题：默认处理不了html中img图片
                        // 处理图片资源
                        test: /\.(png|jpg|gif|jpeg|svg)$/,
                        // 使用一个loader
                        // 下载 url-loader file-loader
                        loader: 'url-loader',
                        options: {
                            // 图片大小小于4kb，就会被base64处理
                            // 优点: 减少请求数量（减轻服务器压力）
                            // 缺点：图片体积会更大（文件请求速度更慢）
                            limit: setting.img.limit,
                            // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是commonjs
                            // 解析时会出问题：[object Module]
                            // 解决：关闭url-loader的es6模块化，使用commonjs解析
                            esModule: false,
                            // 给图片进行重命名
                            // [hash:10]取图片的hash的前10位
                            // [ext]取文件原来扩展名
                            name: '[hash:8].[ext]',
                            outputPath: setting.img.outputPath,
                        }
                    },
                    {
                        test: /\.html$/,
                        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
                        loader: 'html-loader',
                        options: {
                            //webpack4中只需要在url-loader配置esModule webpack5需要html-loader也配置
                            esModule: false,
                        }
                    },
                    // //打包其他资源(除了html/js/css资源以外的资源)
                    {
                        // 排除css/js/html资源
                        exclude: /\.(css|js|json|html|less|styl|sass|scss|png|jpg|gif|jpeg|svg)$/,
                        loader: 'file-loader',
                        options: {
                            name: '[hash:10].[ext]',
                            outputPath: "file",
                        }
                    }
                ]
            },
            ...setting.rules
        ]
    },
    // plugins的配置
    // plugins: 1. 下载  2. 引入  3. 使用
    plugins: (()=>{
        const plugins = [
            new webpack.DefinePlugin((()=>{
                const option = {
                    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    'process.env.BASEURL': JSON.stringify(setting.publicPath)
                };
                for(let k in envOption){
                    option[k] = JSON.stringify(envOption[k])
                };
                
                return option;
            })()),
            // 详细plugins的配置
            //拷贝资源
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: resolve(__dirname, '../public'),
                        to: "./",
                        // transform: {
                        //     transformer(content, path) {
                        //         return optimize(content);
                        //     },
                        //     cache: true,
                        // },
                    },
                ],
            }),
            // 功能：默认会创建一个空的HTML，自动引入打包输出的所有资源（JS/CSS）
            // 需求：需要有结构的HTML文件
            new HtmlWebpackPlugin({
                // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（JS/CSS）
                template: 'index.html',
                // 压缩html代码
                minify: {
                    // 移除空格
                    collapseWhitespace: true,
                    // 移除注释
                    removeComments: true
                },
                scriptLoading: 'blocking'
            }),

            new ESLintPlugin({
                extensions: 'ts',
                fix: true
            }),

            // 压缩css
            //new OptimizeCssAssetsWebpackPlugin()
            ...setting.plugins
        ];

        if(setting.css.separateCss){
            plugins.push(
                //提取css
                new MiniCssExtractPlugin({
                    // 对输出的css文件进行重命名
                    filename: '[name].css'
                }),
            )
        }
        if(setting.gzip){
            plugins.push(
                //开始gzip压缩
                new CompressionPlugin({
                    test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i, //匹配文件名
                    threshold: 10240,//对超过10k的数据压缩
                    deleteOriginalAssets: false //不删除源文件
                })
            )
        }


        

        return plugins

    })(),
    // 模式
    //mode: 'development', // 开发模式 production生产  --mode=development  package,json 文件设置环境
    // 开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器~~）
    // 特点：只会在内存中编译打包，不会有任何输出
    // 启动devServer指令为：npx webpack-dev-server
    devServer: Object.assign({
        publicPath:'/',
        // 项目构建后路径
        contentBase: resolve(__dirname, '../' + setting.outputDir),
        // 启动gzip压缩
        compress: true,
        //当你有错误的时候在控制台打出
        //stats: 'none',
        // 端口号
        port: 8080,
        // 自动打开浏览器
        open: true,
        // 开启HMR功能
        hot: true,
        //错误显示
        overlay: {
            warnings: true,
            errors: true
        }
    }, setting.devServer || {}),

    externals: {
        // 拒绝jQuery被打包进来
        //jquery: 'jQuery'
        ...setting.externals
    },
    // 解析模块的规则
    resolve: {
        // 配置解析模块路径别名: 优点简写路径 缺点路径没有提示
        alias: {
            "@": resolve(__dirname, 'src')
        },
        // 配置省略文件路径的后缀名
        extensions: ['.js', '.json', '.jsx', '.css','.ts','.tsx'],
        // 告诉 webpack 解析模块是去找哪个目录
        //modules: [resolve(__dirname, '../../node_modules'), 'node_modules']
    },

    //报错原始位置
    devtool: isProduction ? (setting.js.productionSourceMap ? 'source-map' : false) : 'eval-cheap-module-source-map',
};
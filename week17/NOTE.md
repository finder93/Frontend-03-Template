学习笔记

### 工具链

-   初始化与构建

    -   初始化工具 yeoman
        -   脚手架 generator ≠ 工具链
        -   yeoman —— 脚手架生成器，generator 的 generator
            -   通过 yeoman 框架，去创建能够初始化项目、创建模板的工具，类似 vue-cli、create-react-app 这样的命令行脚手架
            -   详细 api 参考官网文档 https://yeoman.io/authoring/
            -   主要目录结构
                -   ├───package.json
                -   └───generators/
                    -   ├───app/
                        -   ├───index.js
                        -   ├───templates/
                            -   └───...
            -   this.prompt()
                -   用户交互，接受一个数组作为参数
                -   prompt 方法是异步的，并返回一个 promise。您需要从任务中返回 promise，以便在运行下一个 promise 之前等待它完成
            -   templates 文件夹存放模板文件
                -   this.fs.copyTpl()方法，指定在目标文件调用 generator 后，生成的哪些模板文件
            -   this.fs.extendJSON()和 this.npmInstall()在目标文件中调用 generator 后，安装指定依赖
        -   在目标文件使用 yeoman 生成的 generator 时，需要先安装到本地。
            -   对于开发者，在本地开发 npm 模块的时候，我们可以使用 npm link 命令，将 npm 模块链接到对应的运行项目中去，方便地对模块进行调试和测试。
            -   之后全局安装 yo，即可在目标文件使用命令 yo generatorname 来初始化项目，生成模板
    -   build 工具
        -   Webpack 基础知识
            -   最初是为 Node 设计的打包工具，将 Node 代码 => 浏览器可用代码，针对 JS
            -   基本配置
                -   ```js
                    var path = require("path");
                    module.exports = {
                        mode: "development",
                        entry: "./foo.js",
                        output: {
                            path: path.resolve(__dirname, "dist"),
                            filename: "foo.bundle.js",
                        },
                        module: {
                            rules: [
                                {
                                    test: /\.css$/,
                                    use: [
                                        // [style-loader](/loaders/style-loader)
                                        { loader: "style-loader" },
                                        // [css-loader](/loaders/css-loader)
                                        {
                                            loader: "css-loader",
                                            options: {
                                                modules: true,
                                            },
                                        },
                                        // [sass-loader](/loaders/sass-loader)
                                        { loader: "sass-loader" },
                                    ],
                                },
                            ],
                        },
                        plugins: [
                            new webpack.ProgressPlugin(),
                            new HtmlWebpackPlugin({
                                template: "./src/index.html",
                            }),
                        ],
                    };
                    ```
            -   核心功能就是 loader 和 plugin
            -   loader 的主要功能时做转换，文本和二进制文件转换。
                -   loader 用于对模块的源代码进行转换。
                -   loader 可以使你在 import 或 "load(加载)" 模块时预处理文件。
                -   module.rules 允许你在 webpack 配置中指定多个 loader。 这种方式是展示 loader 的一种简明方式，并且有助于使代码变得简洁和易于维护。
            -   plugin 目的在于解决 loader 无法实现的其他事
                -   plugin 是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在整个编译生命周期都可以访问 compiler 对象。
                -   由于插件可以携带参数/选项，你必须在 webpack 配置中，向 plugins 属性传入一个 new 实例。
        -   Babel 基础知识
            -   独立工具集，不依赖 webpack，实际开发一般集成在 webpack 居多，使用 babel-loader
            -   ```js
                module.exports = {
                    entry: "./main.js",
                    module: {
                        rules: [
                            {
                                test:/\.js$/,
                                use:{
                                    loader:'babel-loader',
                                    options:{
                                        presets:['@babel/preset-env'],
                                        plugins:[...]
                                    }
                                }
                            }
                        ],
                    },
                };
                ```
            -   主要功能是将高版本 ES 转换成低版本
            -   一般使用@babel/preset 和 babel 的 plugin

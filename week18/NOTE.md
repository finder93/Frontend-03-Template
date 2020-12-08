## 学习笔记

    -   单元测试工具
        -   Mocha ——测试业务代码
            -   Mocha 是一个功能丰富的 JavaScript 测试框架，运行在 Node.js 和浏览器上。
            -   最早是一个针对 Node.js 的测试框架，默认在不使用 webpack 之前是不支持 import 和 export，使用 require 引入模块
            -   export 语法默认在 node.js 中无法使用，需要修改 package.json 为 type module，但是导致一些问题，不建议
            -   利用 @babel/register 和 @babel/core，以及 @babel/preset-env 实现 export 语法，注意需要调用本地的 mocha 模块 `./node_modules/mocha/bin/mocha`
                -   ```json
                    // .babelrc文件
                    {
                        "presets": ["@babel/preset-env"]
                    }
                    ```
            -   在 package.json 中修改 scripts 属性中的 test，简化命令行输入
                -   ```json
                    {
                        "name": "test-demo",
                        "version": "1.0.0",
                        "description": "",
                        "main": "index.js",
                        "scripts": {
                            "test": "mocha --require @babel/register"
                        },
                        "author": "",
                        "license": "ISC",
                        "dependencies": {
                            "@babel/core": "^7.12.9",
                            "@babel/preset-env": "^7.12.7",
                            "@babel/register": "^7.12.1",
                            "mocha": "^8.2.1"
                        }
                    }
                    ```
        -   nyc **code coverage** —— 测试用例
            -   用以检测 test 覆盖多少代码,主要看行覆盖率
            -   在复杂文件中计算最终测试的覆盖比例
            -   ```
                ----------|---------|----------|---------|---------|-------------------
                File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
                ----------|---------|----------|---------|---------|-------------------
                All files |     100 |      100 |     100 |     100 |
                add.js    |     100 |      100 |     100 |     100 |
                ----------|---------|----------|---------|---------|-------------------
                ```
            -   nyc 运行带有 babel 的命令，需要为 nyc 添加插件@instanbuljs/nyc-config-babel，需要添加 nycrc 文件，为 babel 添加插件 babel-plugin-istanbul
            -   ```json
                {
                    // .nycrc文件中
                    "extends": "@istanbuljs/nyc-config-babel"
                }
                // -------------------
                {
                    // .babelrc文件中
                    "presets": ["@babel/preset-env"],
                    "plugins": ["istanbul"]
                }
                ```

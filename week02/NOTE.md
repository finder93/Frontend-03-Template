## 浏览器

-   URL -> HTTP 获取 HTML
-   HTML -> parse 文本分析或编译
-   DOM -> CSS copmuting 计算 CSS 熟悉
-   DOM with CSS -> layout 布局
-   DOM with position -> render 渲染
-   Bitmap
-   我们看到的页面都是一个图片形式，专业点的说法叫做位图（Bitmap），然后经过显卡转换为我们可以识别的光信号。
-   整个的过程就是从 URL 转换为 Bitmap 的过程，先发送请求到服务器，然后服务器返回 HTML，浏览器解析 HTML，然后构建 DOM 树，计算 CSS 属性，然后进行排版，最后渲染成位图，然后经过操作系统或硬件的 API 完成视图的显示。

### 状态机

-   **有限状态机**处理字符串
    -   有一个状态都是一个机器
        -   在每一个机器里，我们可以做计算、存储、输出……
        -   每一个机器都是解耦，互不影响
        -   所有的这些机器接受的输入是一致的
        -   状态机的每一个机器本身没有状态，如果我们用函数表示，它应该是**纯函数**（无副作用）
    -   每一个机器知道下一个状态
        -   每一个机器都确定下一个状态（Moore 型）
        -   每一个机器根据输入决定下一个状态（Mealy 型）
    -   JS 中的有限状态机（Mealy）
        -   ```js
            // 每一个函数是一个状态
            function state(input) {
                // 函数参数就是输入
                // 在函数中，可以自由编写代码，处理每个状态逻辑
                return next; // 返回值作为下一个状态
            }
            // 以下是调用 //
            while (input) {
                // 获取输入
                state = state(input); // 把状态机的返回值作为下一个状态
            }
            ```
        -   可以认为在 JS 中状态机的一个理想的实现方式就是**一系列返回值为状态函数的这样的一批状态函数**。
    -   不使用状态机处理字符串
        -   在一个字符串中，找到字符"a"
            -   ```js
                function findChar(str) {
                    let result = str.split("").findIndex((val) => val === "a");
                    if (result >= 0) return true;
                    else return false;
                }
                ```
        -   在一个字符串中，找到字符"ab"
            -   ```js
                function match(str) {
                    for (let i = 0; i < str.length - 1; i++) {
                        if (str[i] + str[i + 1] === "ab") return true;
                    }
                    return false;
                }
                ```
        -   在一个字符串中，找到字符“abcdef”
            -   ```js
                function match(str) {
                    let foundA = false;
                    let foundB = false;
                    let foundC = false;
                    let foundD = false;
                    let foundE = false;
                    for (let c of str) {
                        if (c === "a") {
                            foundA = true;
                            foundB = false;
                            foundC = false;
                            foundD = false;
                            foundE = false;
                        } else if (foundA && c === "b") {
                            foundA = false;
                            foundB = true;
                        } else if (foundB && c === "c") {
                            foundA = false;
                            foundB = false;
                            foundC = true;
                        } else if (foundC && c === "d") {
                            foundA = false;
                            foundB = false;
                            foundC = false;
                            foundD = true;
                        } else if (foundD && c === "e") {
                            foundA = false;
                            foundB = false;
                            foundC = false;
                            foundD = false;
                            foundE = true;
                        } else if (foundE && c === "f") return true;
                        else {
                            foundA = false;
                            foundB = false;
                            foundC = false;
                            foundD = false;
                            foundE = false;
                        }
                    }
                    return false;
                }
                ```
    -   使用状态机处理字符串
        -   ```js
            function match(str) {
                let state = start;
                for (let c of str) {
                    state = state(c);
                }
                return state === end;
            }
            function start(c) {
                if (c === "a") return foundA;
                else return start;
            }
            function end(c) {
                return end;
            }
            function foundA(c) {
                if (c === "b") return foundB;
                else return start(c);
            }
            function foundB(c) {
                if (c === "c") return foundC;
                else return start(c);
            }
            function foundC(c) {
                if (c === "d") return foundD;
                else return start(c);
            }
            function foundD(c) {
                if (c === "e") return foundE;
                else return start(c);
            }
            function foundE(c) {
                if (c === "f") return end;
                else return start(c);
            }
            ```

### HTTP 的协议解析

-   ISO-OSI 七层网络结构模型
    -   HTTP - require("http")
        -   应用层
        -   表示层
        -   会话层
    -   TCP/UDP - require("net")
        -   传输层
    -   Internet - IP
        -   网络层
    -   4G/5G/Wi-Fi - 点对点连接
        -   数据链路层
        -   物理层
-   TCP
    -   流
    -   端口
    -   require("net")
-   IP
    -   包
    -   IP 地址
    -   libnet/libpcao C++库
-   HTTP
    -   Request 格式
        -   Request line
            -   POST/HTTP/1.1
        -   headers
            -   Host:127.0.0.1
            -   Content-Type:application/x-www-forom-urlencoded
        -   空白行
        -   body - 由 Content-Type 决定格式
    -   设计一个 HTTP 请求的类
        -   Content-Type 是一个必要的字段，要有默认值
        -   body 是 key-value 的格式
        -   在 Request 构造器中手机必要的信息
        -   设计一个 send 哈数，把请求真实发送到服务器
        -   send 函数为异步函数，返回一个 Promise 对象
        -   设计支持已有的 connection 或者自己新建 connection
        -   收到数据传给 parser
        -   根据 parser 的状态 resolve Promise
    -   Response 格式
        -   status line
            -   HTTP/1.1 200 OK
                -   http 状态码
        -   headers
            -   Conten-Type:text/html
            -   Date:Mon,23 Dec 2019 06:46:19 GMT
            -   Connection:keep-alive
            -   Transfer-Encoding:chunked
        -   空白行
        -   body - 由 Content-Type 决定格式
    -   ResponseParser
        -   Response 必须分段构造，所以用一个 ResponseParser 来装配
        -   ResponseParser 分段处理 ResponseText，使用状态机来分析文本结构
    -   BodyParser
        -   Response 的 body 可能根据 Content-Type 有不同结构，因此采用子 Parser 的结构来解决

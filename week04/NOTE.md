学习笔记

### HTTP 请求

-   第一步 设计一个 HTTP 请求类
    -   content-type 是一个必要的字段，要有默认值
    -   body 是 KV 格式
    -   不同的 content-type 影响 body 格式
-   第二步 send 函数设计
    -   设计一个 send 函数，把请求真实发送到服务器
    -   send 函数为异步函数，返回一个 Promise 对象
-   第三步 发送请求
    -   设计支持已有的 connection 或者自己新建 connection
    -   收到数据传给 parser
    -   根据 parser 的状态 resolve Promise
-   第四步 ResponseParser
    -   Response 必须分段构造，所以用一个 ResponseParser 来装配
    -   ResponseParser 分段处理 ResponseText，使用状态机来分析文本结构
-   第五步 BodyParser
    -   Response 的 body 可能根据 Content-Type 有不同结构，因此采用子 Parser 的结构来解决

### HTML 解析

-   第一步 HTML parse 模块拆分
    -   方便文件管理，将 parser 单独拆到文件件中，作为单独模块引入
    -   parser 接受 HTML 文本作为参数，返回一棵 DOM 树
-   第二步
    -   利用 FSM 实现 HTML 的分析
    -   在 HTML 标准中，已经规定了 HTML 的状态
    -   Toy-Browser 只挑选其中一部分，完成一个最简单的版本
-   第三步 解析标签
    -   主要标签：开始标签、结束标签和自封闭标签
    -   暂时忽略标签属性
-   第四步 创建元素
    -   状态机中，除了状态迁移，还会加入业务逻辑
    -   在标签的结束状态提交标签 token
-   第五步 处理属性
    -   属性值分为单引号、双引号、无引号三种写法，需要较多状态处理
    -   处理属性方式和标签类似
    -   属性结束时，把属性加到标签 Token 上
-   第六步 用 token 构建 DOM 树
    -   从标签构建 DOM 树的基本技巧是**使用栈**
    -   遇到开始标签时创建元素并入栈，遇到结速标签时出栈
    -   **自封闭的节点可视为入栈后立即出栈**
    -   任何元素的父元素是它入栈前的栈顶
-   第七步 将文本节点加到 DOM 树
    -   文本节点与自封闭标签处理类似
    -   多个文本节点需要合并

### CSS 计算

-   第一步 收集 CSS 规则
    -   遇到 style 标签时，把 CSS 规则保存起来
    -   调用 CSS Parser 来分析 CSS 规则
    -   注意研究库分析 CSS 规则的格式
-   第二部 添加调用
    -   当创建一个元素后，立即计算 CSS
    -   理论上，当分析一个元素时，所有 CSS 规则已经收集完毕
    -   在真实浏览器中，可能遇到写在 body 里面的 style 标签，需要重新 CSS 计算的情况
-   第三部 获取父元素序列
    -   在 computeCSS 函数中，必须知道元素的所有父元素才能判断元素与规则是否匹配
    -   利用上一步骤的 stack，可以获取元素所有的父元素
    -   因为首先获取的是“当前元素”，所以获取和计算父元素匹配的顺序都是从内向外
-   第四步 选择器与元素的匹配
    -   选择器也要从当前元素向外排列
    -   复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列
-   第五步 计算选择器与元素匹配
    -   根据选择器的类型和元素属性，计算是否与当前元素匹配
    -   目前仅实现三种基本选择器，实际的浏览器中还要处理复合选择器
-   第六步 生成 computed 属性
    -   一旦选择器匹配，就应用选择器到元素上，形成 computedStyle
-   第七步 specificity 的计算逻辑
    -   specificity
        -   [0(inline), 0(id), 0(class), 0(tag)]
        -   如 div #my #id -> [0, 2, 0, 1]
        -   div div #id -> [0, 1, 0, 2]
    -   CSS 规则根据 specificity 和后来优先规则覆盖
    -   specificity 是个四元组，越左边权重越高
    -   一个 CSS 规则的 specificity 根据包含的简单选择器相加而成

### layout 排版/布局

-   第一步 根据浏览器属性进行排版/预处理
    -   属性抽象
    -   主轴水平
        -   flex-direction: row
        -   Main: width x left right
        -   Cross: height y top bottom
    -   主轴竖直
        -   flex-direction: column
        -   Main: height y top bottom
        -   Cross: width x left right
-   第二步 收集元素进行
    -   分行
        -   根据主轴尺寸，把元素 flex-item 分行
        -   若设置了 no-wrap，则强行分配进第一行
-   第三步 计算主轴
    -   计算主轴方向
        -   找出所有 flex 元素
        -   把主轴方向的剩余尺寸按比例分配给这些元素
        -   若剩余空间为负数，所有 flex 元素为 0,等比例压缩剩余元素
-   第四步 计算交叉轴
    -   计算交叉轴方向
        -   根据每一行中最大元素尺寸计算行高
        -   根据行高 flex-align 和 item-align，确定元素位置

### 渲染

-   第一步 绘制单个元素
    -   绘制需要依赖一个图形环境
    -   采用 npm 包 images
    -   绘制在一个 viewport 上进行
    -   与绘制相关属性：background-color、border、background-image 等
-   第二部 绘制 DOM 树
    -   递归调用子元素的绘制方法完成 DOM 树的绘制
    -   忽略了一些不需要绘制的节点
    -   实际浏览器中，文字绘制是难点，需要依赖字体库
    -   实际浏览器中，还会对一些图层做 compositing

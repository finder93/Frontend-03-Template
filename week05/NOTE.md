学习笔记

### CSS 总论

-   CSS 语法的研究

    -   @rules
        -   @chartset
        -   @import
        -   rules：
        -   @media
        -   @page
    -   rule

-   CSS @规则的研究

    -   @charset: https://www.w3.org/TR/css-syntax-3/
    -   @import: https://www.w3.org/TR/css-cascade-4/
    -   **@media**: https://www.w3.org/TR/css3-conditional/
    -   @page: https://www.w3.org/TR/css-page-3/
    -   @counter-style: https://www.w3.org/TR/css-counter-styles-3/ - 列表
    -   **@keyframes**: https://www.w3.org/TR/css-animations-1/ -动画
    -   **@fontface**: https://www.w3.org/TR/css-fonts-3/
    -   @supports: https://www.w3.org/TR/css3-conditional/ - 检查 CSS 功能存不存在，有兼容性问题
    -   @namespace: https://www.w3.org/TR/css-namespaces-3/

-   CSS 规则的研究

    -   选择器
        -   selector group
        -   selector
            -   \>
            -   `<sp>`
            -   \+
            -   ~
        -   simple selector
            -   type
            -   \*
            -   \.
            -   \#
            -   []
            -   :
            -   ::
            -   :not()
    -   声明
        -   Key
            -   variables
            -   properties
        -   Value
            -   calculate
            -   number
            -   length
            -   ...

-   收集标准

### CSS 选择器

-   选择器语法
    -   简单选择器
        -   \*
        -   div sig|a
        -   .cls
        -   #id
        -   `[attr=value]`
        -   :hover
        -   ::before
-   复合选择器
    -   <简单选择器><简单选择器><简单选择器>
    -   \*或者 div 必须写在前面
-   复杂选择器
    -   <复合选择器>`<sp>`<复合选择器>
    -   <复合选择器>">"<复合选择器>
    -   <复合选择器>"~"<复合选择器>
    -   <复合选择器>"+"<复合选择器>
    -   <复合选择器>"||"<复合选择器> - 表格选择其中某一列
-   选择器优先级
    -   简单选择器计数
    -   pecificity 的计算逻辑
    -   specificity
        -   [0(inline), 0(id), 0(class), 0(tag)]
        -   如 div #my #id -> [0, 2, 0, 1]
        -   div div #id -> [0, 1, 0, 2]
    -   CSS 规则根据 specificity 和后来优先规则覆盖
    -   specificity 是个四元组，越左边权重越高
-   伪类
    -   链接/行为
        -   :any-link
        -   :link :visited
        -   :hover
        -   :active
        -   :focus
        -   :target
    -   树结构
        -   :empty
        -   :nth-child()
        -   :nth-last-child()
        -   :first-child :last-child :only-child
    -   逻辑性
        -   :not 伪类
        -   :where :has
-   伪元素
    -   ::before
    -   ::after
    -   ::first-line
    -   ::first-letter

###　思考题：为什么 first-letter 可以设置 display:block / float 而 first-line 不行？
first-line 需要计算第一行有那些元素，根据元素宽度、文档宽度、文本文字大小不同，第一行的元素也不相同。
first-letter 是确定的第一个字符，可以正常顺序计算，不需要重新排版

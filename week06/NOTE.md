学习笔记

### CSS 排版

-   盒
    -   Html 代码中可以书写开始 Tag,结束 Tag，和自封闭 Tag
    -   一对起止 Tag 表示一个元素 Dom 树中存储的是元素和其他类型的节点
    -   Css 选择器选中的是元素
    -   Css 选择器选中的元素，在排版时可能产生多个盒 排版和渲染的基本单位是盒
-   盒模型
    -   由外到内：margin,border,padding,content
    -   box-sizing 两种
        -   content-box: content 的 size 就是盒的 size (默认)
        -   border-box: content+padding+border 是盒的 size
-   正常流
    -   三代排版技术: 正常流 flex grid
    -   css 排版只排 盒 和 字 两种元素
    -   排版步骤:
        -   收集盒和文字进行(hang)
        -   计算盒在行中的排布
        -   计算行与行的排布
    -   行内盒 line-box . 块级盒: block-level-box (BFC)
-   正常流的行级排布
    -   Baseline 文字对齐的基础线
    -   Text
    -   行模型: 5 条线
        -   line-top //行高 盒如果太高会被撑开
        -   text-top //根据字体 size 变
        -   base-line
        -   text-bottom
        -   line-bottom
    -   vertical-align 设置对齐的线
    -   inlinebox 的对齐 默认是 box 里面最后一行文字的 baseline 和外面的 baseline 对齐,更改 vertical-align 会改变对齐方式.推荐只用 top/bottom.
-   正常流的块级排布
    -   正常流的两个机制 - float float 元素会影响自己高度内的所有行盒的宽度. float 元素会被 float 元素影响,如果浮动方向有元素,会产生堆叠(类似卡住) 这时给 float 加一个 clear 属性,他会自动调整纵向位置,自动置顶(clear 类似清理空间)
    -   margin 合并 两个 margin 相连,会堆叠,取 Max.只发生在 bfc 里
-   BFC 合并
    -   Block
        -   block container: 里面有 bfc 的 1. 能容纳正常流的盒,里面就有 bfc
            -   block
            -   inline-block
            -   table-cell
            -   flex item
            -   grid cell
            -   table-caption
        -   block-level Box:外面有 BFC 的
            -   block level: display:(block flex table grid)
            -   inline level: display(inline-block inline-flex inline-table inline-grid)
        -   block box = block container + block-level box 里外都有 BFC 的
        -   什么情况下会设立 BFC
            -   floats
            -   absolutely positioned element
            -   bloack containers(such as inline-block,table-cells,and table-captions)that are not block boxes,
            -   flex items
            -   grid cell
            -   and block boxes with overflow other than visible
        -   BFC 合并 - block box && overflow:visible - bfc 合并与 float - bfc 合并与边距折叠
        -   BFC 相对于一个新的渲染排版上下文,他无法感知到外部的信息,同一个 bfc 下会发生外边距折叠.
-   Flex 排版
    -   排版逻辑
        -   收集盒进行(没有文字,文字也是盒)
    -   计算盒在主轴方向的排布
        -   计算盒在交叉轴方向的排布
    -   分行
        -   根据主轴尺寸,把元素分进行
        -   若设置了 no-wrap,则强行分配进行第一行
    -   计算主轴方向
        -   找出所以 flex 元素
        -   把主轴方向的剩余尺寸按比例分配给这些元素
        -   若剩余空间为负数,所有 flex 元素置为 0,剩下的等比压缩
    -   计算交叉轴方向
        -   根据每一行中最大元素计算行高
        -   根据行高 flex-align 和 item-align,确定元素具体位置

### CSS 动画与绘制

-   动画
    -   Animation:
        -   @keyframes 定义
        -   animation:使用
        -   ```css
            @keyframes mykf {
                from {
                    background: red;
                }
                to {
                    background: yellow;
                }
            }
            div {
                animation: mykf 5s infinite;
            }
            ```
        -   属性:
            -   animation-name 时间曲线
            -   animation-duration 动画的时长
            -   animation-timing-function 动画的时间曲线
            -   animation-delay 动画开始前的延迟
            -   animation-iteration-count 动画的播放次数
            -   animation-direction 动画的方向
        -   Keyframe 可以定义 transition 来定义不同关键帧不同的时间曲线
    -   Transition
        -   transition-property 要变换的属性
        -   transition-duration 变换的时长
        -   transition-timing-fuction 时间曲线
        -   来自于三次贝塞尔曲线
        -   可以用来拟合抛物线,圆滑各种动画
        -   transition-delay 延迟
    -   颜色
        -   三原色: RGB
        -   三原色的补色:CMY(青、平红、黄) 加上黑色做印刷的基本颜料
        -   HSL H 表示色相,S 表示纯度,L 表示亮度
        -   HSV V 表示明度 value100% 最亮,L 100 纯白色,0 纯黑色,中间是纯色
        -   HSL 的优势:
            -   统一换颜色,亮度纯度不会变,更加协调
    -   绘制
        -   几何图形
            -   border
            -   box-shadow
            -   border-radius
        -   文字
            -   font
            -   text-decoration
        -   位图
            -   background-image
        -   底层 shader 绘制
        -   data uri + svg

学习笔记

### proxy 与双向绑定

-   proxy 的基本用法
    -   ```js
        let object = {
            a: 1,
            b: 2,
        };
        let po = new Proxy(object, {
            get(obj, prop, val) {
                console.log(...arguments);
                return 0;
            },
        });
        ```
    -   如果有一个对象，我们既想要去让它设置起来，有想要能被监听，我们用 proxy 把这个 object 做一层包裹
    -   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
-   模仿 reactive 实现原理
    -   变量 callbacks 存储所有 callbacks，格式：key -> object, value -> { key -> prop, value -> [callbacks] }
    -   reactive()函数来将普通 object 包装成 Proxy，可以改写 set、get 等
    -   在 effect()函数中将 callback 存入 callbacks 中
    -   为实现多层的 object，我们引入 reactivities 变量，格式：key -> object, value -> 对应的 Proxy
-   reactivity 响应式对象
    -   双向绑定
        -   数据到 DOM 元素： 使用 effect 函数，比如
            -   ```js
                effect(() => {
                    document.getElementById("r").value = po.r;
                });
                ```
        -   DOM 元素到数据：DOM 本身的监听操作，比如
            `document.getElementById("r").addEventListener('input', event => po.r = event.target.value);`

### 使用 Range 实现 DOM 精确操作

-   基本拖拽
    -   drag 我们是有对应的 dragdrop 事件， 但是我们希望跟随鼠标进行移动，我们用 mousedown、mousemove、mouseup 来模拟
    -   在 mousedown 里面监听 mousemove 和 mouseup 事件，只有我们鼠标按下去之后监听，才能在性能上和逻辑上正确。如果 mousemove 在 mousedown 之外，那么只要鼠标移动，这个事件就触发了，即使用 flag 标记在 mousedown 没有发生的情况下也不触发 mousemove，对性能也有一定影响。
    -   mousemove 和 mouseup 是在 document 上监听，如果在 draggable 上监听，鼠标移动过快，可能会发生拖断现象。
-   正常流里的拖拽
    -   “文字” 里面没有分节点，所以只能通过 Range 找到能拖拽的空位。
    -   我们用一个变量存储所有的 ranges。在 mousemove 的时候找到最近的 range，插入 draggable 的元素

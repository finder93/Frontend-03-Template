学习笔记

-   JS 实现动画
    -   设置每一帧需要触发的事件
    -   一般设置 16ms 延时，因为人眼最高识别帧率为 60 帧/秒
    -   常用三种实现方式
        -   setInterval()
            -   不推荐，不可控，可能会积压
            -   ```js
                setInterval(() => {}, 16);
                ```
        -   setTimeout()
            -   ```js
                let tick = () => {
                    setTimeout(tick, 16);
                };
                ```
        -   requestAnimationFrame()
            -   与浏览器的帧率相关，申请下一帧执行代码
            -   ```js
                let tick = () => {
                    requestAnimationFrame(tick);
                };
                ```
        -   TimeLine 时间线
            -   ```js
                    class TimeLine {
                    constructor() {}
                    start() {}
                    // 播放速率
                    set rate(){}
                    get rate(){}
                    // 暂停/继续
                    pause() {}
                    resume() {}
                    // 重启
                    reset(){}
                }
                ```
            -   进行状态管理，使 TimeLine 更具健壮性
    -   属性动画
        -   通过改变对象的属性来实现动画效果

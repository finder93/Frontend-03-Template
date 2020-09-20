学习笔记

## TicTacToe | 实现一个 TicTacToe 游戏

## Javascript 的异步机制

-   callback
    -   容易导致回调地狱
    -   ```js
        function go() {
            green();
            setTimeout(() => {
                yellow();
                setTimeout(() => {
                    red();
                    setTimeout(() => {
                        go();
                    }, 500);
                }, 200);
            }, 1000);
        }
        ```
-   Promise
    -   链式调用
    -   ```js
        function sleep(t) {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, t);
            });
        }
        function go() {
            green();
            sleep(1000)
                .then(() => {
                    yellow();
                    return sleep(200);
                })
                .then(() => {
                    red();
                    return sleep(500);
                })
                .then(go);
        }
        ```
-   async/await
    -   接近同步语法
    -   ```js
        async function go() {
            while (true) {
                green();
                await sleep(1000);
                yellow();
                await sleep(200);
                red();
                await sleep(500);
            }
        }
        ```
-   generator 与异步

    -   generator 模拟 async/await
        -   ```js
            function* go() {
                while (true) {
                    green();
                    yield sleep(1000);
                    yellow();
                    yield sleep(200);
                    red();
                    yield sleep(500);
                }
            }
            function run(iterator) {
                let { value, done } = iterator.next();
                if (done) return;
                if (value instanceof Promise) {
                    value.then(() => {
                        run(iterator);
                    });
                }
            }
            function co(generator) {
                return function () {
                    return run(generator());
                };
            }
            ```
    -   async generator
        -   ```js
            function sleep(t) {
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, t);
                });
            }
            async function* counter() {
                let i = 0;
                while (true) {
                    await sleep(1000);
                    yield i++;
                }
            }
            (async function () {
                for await (let v of counter()) {
                    console.log(v);
                }
            })();
            ```

export class Dispatcher {
    constructor(element) {
        this.element = element;
    }
    dispatch(type, properties) {
        let event = new Event(type);
        for (let name in properties) {
            event[name] = properties[name];
        }
        element.dispatchEvent(event);
    }
}
export class Listener {
    constructor(element, recognizer) {
        let isListeningMouse = false;

        let contexts = new Map();

        // 移动端无法触发mouse系列事件
        element.addEventListener("mousedown", (event) => {
            let context = Object.create(null);
            contexts.set("mouse" + (1 << event.button), context);

            recognizer.start(event, context);

            let mousemove = (event) => {
                let button = 1;

                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        //   event.button和event.buttons中鼠标按键的顺序是不同的
                        let key;
                        if (button == 2) {
                            key = 4;
                        } else if (button == 4) {
                            key = 2;
                        } else {
                            key = button;
                        }
                        let context = contexts.get("mouse" + key);
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }
            };

            let mouseup = (event) => {
                let context = contexts.get("mouse" + (1 << event.button));
                recognizer.end(event, context);
                contexts.delete("mouse" + (1 << event.button));

                if (event.buttons === 0) {
                    document.removeEventListener("mousemove", mousemove);
                    document.removeEventListener("mouseup", mouseup);
                    isListeningMouse = false;
                }
            };

            if (!isListeningMouse) {
                document.addEventListener("mousemove", mousemove);
                document.addEventListener("mouseup", mouseup);
                isListeningMouse = true;
            }
        });

        // touchstart之后一定会触发touchmove，两者一定在同一元素上触发
        element.addEventListener("touchstart", (event) => {
            // touch事件可能是有多个触点，用identifier表示touch事件的唯一id，用于追踪出点
            for (let touch of event.changedTouches) {
                let context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        });
        element.addEventListener("touchmove", (event) => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        });
        element.addEventListener("touchend", (event) => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        });
        // touchcancel表示touch点序列以异常模式去结束
        element.addEventListener("touchcancel", (event) => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
                contexts.delete(context);
            }
        });
    }
}
export class Recognizer {
    constructor(dispatcher) {
        this.dispatcher = dispatcher;
    }
    start(point, context) {
        (context.startX = point.clientX), (context.startY = point.clientY);
        context.points = [
            {
                time: Date.now(),
                x: point.clientX,
                y: point.clientY,
            },
        ];

        context.isTap = true;
        context.isPan = false;
        context.isPress = false;

        context.handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null;
            this.dispatcher.dispatch("press", {});
        }, 500);
    }
    move(point, context) {
        let dx = point.clientX - context.startX,
            dy = point.clientY - context.startY;

        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy);

            this.dispatcher.dispatch("panstart", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
            });
            clearTimeout(context.handler);
        }

        if (context.isPan) {
            this.dispatcher.dispatch("pan", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
            });
        }

        // 过滤
        context.points = context.points.filter(
            (point) => Date.now() - point.time < 500
        );
        context.points.push({
            time: Date.now(),
            x: point.clientX,
            y: point.clientY,
        });
    }
    end(point, context) {
        if (context.isTap) {
            this.dispatcher.dispatch("tap", {});
            clearTimeout(context.handler);
        }

        if (context.isPress) {
            this.dispatcher.dispatch("pressend", {});
        }

        context.points = context.points.filter(
            (point) => Date.now() - point.time < 500
        );

        let d, v;
        if (!context.points.length) {
            v = 0;
        } else {
            // 计算速度
            d = Math.sqrt(
                (point.clientX - context.points[0].x) ** 2 +
                    (point.clientY - context.points[0].y) ** 2
            );
            v = d / (Date.now() - context.points[0].time);
        }

        if (v > 1.5) {
            this.dispatcher.dispatch("flick", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v,
            });
            context.isFlick = true;
        } else {
            context.isFlick = false;
        }

        if (context.isPan) {
            this.dispatcher.dispatch("panend", {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
            });
        }
    }
    cancel(point, context) {
        clearTimeout(context.handler);
        this.dispatcher.dispatch("cancel", {});
    }
}

// listen => recognize => dispatch

// new Listner(new Recognizer(dispatch))
export function enableGesture(element) {
    new Listener(element, new Recognizer(new Dispatcher(element)));
}

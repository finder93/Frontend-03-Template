const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick_handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start_time");
const PAUSE_START = Symbol("pause_start");
const PAUSE_TIME = Symbol("pause_time");

export class TimeLine {
    constructor() {
        this.state = "Inited";
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
    }

    start() {
        if (this.state !== "Inited") return;
        this.state = "started";
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;

        this[TICK] = () => {
            let now = Date.now();
            for (let animation of this[ANIMATIONS]) {
                let t;

                if (this[START_TIME].get(animation) < startTime) {
                    t = now - startTime - this[PAUSE_TIME] - animation.delay;
                } else {
                    t =
                        now -
                        this[START_TIME].get(animation) -
                        this[PAUSE_TIME] -
                        animation.delay;
                }

                if (animation.duartion < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duartion;
                }
                if (t > 0) animation.receiveTime(t);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        };
        this[TICK]();
    }

    // set rate(){}
    // get rate(){}

    pause() {
        if (this.state !== "started") return;
        this.state = "paused";
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume() {
        if (this.state !== "paused") return;
        this.state = "started";
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }

    reset() {
        this.pause();

        this.state = "Inited";
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[TICK_HANDLER] = null;
        this[PAUSE_START] = 0;
    }

    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    constructor(
        object,
        property,
        satrtValue,
        endValue,
        duartion,
        delay,
        timingFunction,
        template
    ) {
        timingFunction = timingFunction || ((v) => v);
        template = template || ((v) => v);

        this.object = object;
        this.property = property;
        this.satrtValue = satrtValue;
        this.endValue = endValue;
        this.duartion = duartion;
        this.delay = delay;
        this.timingFunction = timingFunction;
        this.template = template;
    }
    receiveTime(time) {
        // console.log(time);
        let range = this.endValue - this.satrtValue;
        let progress = this.timingFunction(time / this.duartion);

        this.object[this.property] = this.template(
            this.satrtValue + range * progress
        );
    }
}

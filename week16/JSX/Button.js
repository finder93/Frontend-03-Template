import { Component, STATE, ATTRIBUTE, createElement } from "./framework.js";
import { enableGesture } from "./gesture.js";

export { STATE, ATTRIBUTE } from "./framework.js"; // 提供给其他继承carousel的组件使用

export class Button extends Component {
    constructor() {
        super();
    }

    render() {
        this.childContainer = <span />;
        this.root = (<div>{this.childContainer}</div>).render();
        return this.root;
    }
    appendChild(child) {
        if (!this.childContainer) {
            this.render();
        }
        this.childContainer.appendChild(child);
    }
}

import {extend} from './utils';
import setting from './option';
export abstract class XSHEET {
    rootEl: HTMLElement;
    Canvas: CANVAS;
    boxWidth: number;
    boxHeight: number;
    option?: OPTION;
    constructor(dom: HTMLElement | string , option: OPTION){
        this.rootEl = typeof dom === 'string' ? document.querySelector(dom) : dom;
        this.option = option || {};
        extend(this.option,setting);
        console.log(this.option)
    }
}

export abstract class CANVAS {
    dom: HTMLCanvasElement;
    context: XSHEET;
    constructor(context: XSHEET){
        this.context = context;
    }
}
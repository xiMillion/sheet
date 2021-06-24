import './index.less';
import Canvas from './canvas';
import {XSHEET} from './class';

const log = console.log;

class XSheet extends XSHEET{

    static versions = '1.00';
    static log = log;

    constructor (public dom: HTMLElement | string , public option?: OPTION){

        super(dom,option)

        // this.rootEl = typeof dom === 'string' ? document.querySelector(dom) : dom;

        this.init();

        this.Canvas = new Canvas(this);

        this.rootEl.appendChild(this.Canvas.dom);
    }

    init():void{
        this.getRootRect();
    }

    getRootRect():void{
        this.boxWidth = this.rootEl.offsetWidth;
        this.boxHeight = this.rootEl.offsetHeight;
    }
}

new XSheet('#box',{
    
})

export default XSheet;
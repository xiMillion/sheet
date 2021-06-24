import {CANVAS,XSHEET} from './class';

export default class Canvas extends CANVAS {

    constructor(context: XSHEET){

        super(context);

        this.dom = document.createElement('canvas');
        this.init(context.boxWidth,context.boxHeight);
    }

    init(width:number,height:number):void{
        this.dom.width = width;
        this.dom.height = height;
        this.dom.style.border = '1px solid #111'
    }
}
export default class Canvas{
    dom: HTMLCanvasElement;
    constructor(){
        this.dom = document.createElement('canvas');

    }

    init(width:number,height:number):void{
        this.dom.width = width;
        this.dom.height = height;
    }
};
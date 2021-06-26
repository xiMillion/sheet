import './index.less';
import Canvas from './canvas';
import setting from './default';
import {extend} from './utils';

const log = console.log;

class XSheet{
    //容器元素
    rootEl: HTMLElement;
    //canvas类
    Canvas: Canvas;
    //容器高宽
    boxWidth: number;
    boxHeight: number;
    //滚动条
    scrollTop:number;
    scrollLeft:number;
    //当前选区
    region: Region;
    //根据容器宽高算出的范围
    startRowIndex:number;
    endRowIndex:number;
    startColIndex:number;
    endColIndex:number;
    //左侧表头宽度
    rowBarWidth:number;
    //固定区域偏移量 包含表头
    fixedOffsetTop: number;
    fixedOffsetLeft: number;

    static versions = '1.00';
    static log = log;

    constructor (public dom: HTMLElement | string , public option?: Option){

        console.time('render');

        this.rootEl = typeof dom === 'string' ? document.querySelector(dom) : dom;
        this.option = option || {};

        this.handOption();

        this.init();

        this.Canvas = new Canvas(this);

        this.rootEl.appendChild(this.Canvas.canvas);

        console.timeEnd('render');
    }

    init():void{
        this.scrollTop = 0;
        this.scrollLeft = 0;

        //next grid 行高发生改变，固定单元格操作  需要重新调用
        this.rowBarWidth = this.getRowBarWidth();
        this.fixedOffsetLeft = this.getFixedOffsetLeft();
        this.fixedOffsetTop = this.getFixedOffsetTop();

        //next 2  宽高发生改变需要重新调用
        this.getRootRect();
        //mext 3
        this.calculation();
        
    }

    calculation():void{
        const {scrollTop,scrollLeft,boxWidth,boxHeight} = this;

        const {startRowIndex,endRowIndex} = this.findNearestItemIndex_row(scrollTop,scrollTop + boxHeight);
        const {startColIndex,endColIndex} = this.findNearestItemIndex_col(scrollLeft,scrollLeft + boxWidth);
        
        this.startRowIndex = startRowIndex;
        this.endRowIndex = endRowIndex;
        this.startColIndex = startColIndex;
        this.endColIndex = endColIndex;
    }
    

    getRootRect():void{
        this.boxWidth = this.rootEl.offsetWidth;
        this.boxHeight = this.rootEl.offsetHeight;
    }

    handOption(): void{

        extend(this.option,setting,false);

        const rowLength:number = this.option.row.length;
        const rowMap:RowMap[] = this.option.row.map;
        const rowHeight:number = this.option.style.row.height;

        for(let r = 0; r < rowLength; r ++){
            rowMap[r] = rowMap[r] || {
                height: rowHeight
            }
        }


        const colLength:number = this.option.col.length;
        const colMap:ColMap[] = this.option.col.map;
        const colWidth:number = this.option.style.col.width;

        for(let c = 0; c < colLength; c ++){
            colMap[c] = colMap[c] || {
                width: colWidth,
                filter: false,
                sort: false
            }
        }

    }

    findNearestItemIndex_row(scrollTop_strat:number,scrollTop_end:number): {startRowIndex:number,endRowIndex:number} {
        const {option} = this;
        const rowMap:RowMap[] = option.row.map;
        const rowLength:number = option.row.length;
        const fixedEnd:number = option.row.fixedEnd;
        let total = 0 , startRowIndex:number , endRowIndex:number;

        for (let i = fixedEnd; i < rowLength; i++) {

            total += rowMap[i].height;

            if (startRowIndex === undefined && total >= scrollTop_strat) {
                startRowIndex = i;
            }else if (total >= scrollTop_end) {
                endRowIndex = i;
                break;
            }
        }

        return {startRowIndex,endRowIndex};
    }
    findNearestItemIndex_col(scrollLeft_strat:number,scrollLeft_end:number):{startColIndex:number,endColIndex:number} {
        const {option} = this;
        const colMap:ColMap[] = option.col.map;
        const colLength:number = option.col.length;
        const fixedEnd:number = option.col.fixedEnd;
        let total = 0, startColIndex:number , endColIndex:number;

        for (let i = fixedEnd; i < colLength; i++) {

            total += colMap[i].width;
            if (startColIndex === undefined && total >= scrollLeft_strat) {
                startColIndex = i;
            }else if (total >= scrollLeft_end) {
                endColIndex = i;
                break;
            }
        }

        return {startColIndex,endColIndex};
    }

    getRowBarWidth():number{
        const rowWidth:number | string = this.option.style.row.width;
        const fontSize = this.option.style.row.fontSize;
        return (rowWidth === 'maxw' ? (String(this.option.row.length + 1).length * fontSize + 5) : rowWidth as number);
    }

    getFixedOffsetLeft():number{
        const {option} = this;
        const colMap:ColMap[] = option.col.map;
        const fixedStart = option.col.fixedStart;
        const fixedEnd = option.col.fixedEnd;
        let total:number = this.rowBarWidth;
        for(let i = fixedStart; i < fixedEnd; i ++){
            total += colMap[i].width;
        }
        return total;
    }

    getFixedOffsetTop():number{
        const {option} = this;
        const rowMap:RowMap[] = option.row.map;
        const fixedStart = option.row.fixedStart;
        const fixedEnd = option.row.fixedEnd;

        let total:number = option.style.col.height;
        for(let i = fixedStart; i < fixedEnd; i ++){
            total += rowMap[i].height;
        }
        return total;
    }
}

const dataSet:any = [];

for(let r = 0; r < 1000; r ++){
    dataSet[r] = [];
    for(let c = 0; c < 1000; c ++){
        dataSet[r].push({
            w: `${r}-${c}`
        })
    
    }
}

new XSheet('#box',{
    dataSet,
    // row:{
    //     fixedStart: 0,
    //     fixedEnd: 10
    // }
})

export default XSheet;
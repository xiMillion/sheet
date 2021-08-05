import './index.less';
import Canvas from './canvas';
import setting from './default';
import {extend,getTextReact,Span} from './utils';

const log = console.log;

/**
 * 线宽 0.5 不生效 -->  渲染机制 需加 0.5
 * 字体模糊  -> 浏览器放大了  需设置倍数
 * 行高自适应 表格总体高度随改变
 * 渲染函数再次抽象化，固定表格函数也要diff
 */

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
    //滚动偏移量
    scrollOffsetTop:number;
    scrollOffsetLeft:number;
    //左侧表头宽度
    rowBarWidth:number;
    //固定区域偏移量 包含表头
    fixedOffsetTop: number;
    fixedOffsetLeft: number;

    //滚动盒子
    scrollBoxEl:HTMLElement;
    scrollContentEl:HTMLElement;

    static versions = '1.00';
    static log = log;

    constructor (public dom: HTMLElement | string , public option?: Option){

        console.time('init');

        this.rootEl = typeof dom === 'string' ? document.querySelector(dom) : dom;
        this.rootEl.className = 'xsheet-table';
        this.rootEl.style.border = '1px solid #ddd'
        
        this.option = option || {};

        this.handOption();

        //宽高发生改变需要重新调用
        this.getRootRect();

        this.Canvas = new Canvas(this);

        this.init();

        this.render();

        console.timeEnd('init');
    }

    init():void{
        this.scrollTop = 0;
        this.scrollLeft = 0;

        const {col,row} = this.option;

        //next grid 行高发生改变，固定单元格操作  需要重新调用
        this.rowBarWidth = this.getRowBarWidth();
        this.fixedOffsetLeft = this.getRowOffsetWidth(col.fixedStart,col.fixedEnd) + this.rowBarWidth;
        this.fixedOffsetTop = this.getColOffsetHeight(row.fixedStart,row.fixedEnd) + col.style.height;


        //mext 2
        this.calculation();

        // next 1
        this.generateFrame();
        //next 2
        this.setScrollStyle();

        //re fixed
        this.Canvas.renderFixedTable();
        
    }

    render():void{
        this.Canvas.render();
    }

    /***********************Event***************************/

    scrollFn(event: Event):void{
        console.time('render');
        this.scrollTop = (event.target as HTMLElement).scrollTop;
        this.scrollLeft = (event.target as HTMLElement).scrollLeft;

        this.calculation();
        this.render();
        console.timeEnd('render');
    }


    setScroll(l:number,t:number):void{
        this.scrollTop = t;
        this.scrollLeft = l;

        this.calculation();
        this.render();
    }

    /************************dom***************************/

    generateFrame():void{

        this.scrollBoxEl = document.createElement('div');
        this.scrollBoxEl.className = 'xsheet-table-scrollbox';

        this.scrollBoxEl.addEventListener('scroll',this.scrollFn.bind(this));

        this.scrollContentEl = document.createElement('div');
        this.scrollBoxEl.appendChild(this.scrollContentEl);
        this.rootEl.appendChild(this.scrollBoxEl);
    }

    setScrollStyle():void{
        //设置盒子宽高
        this.scrollContentEl.style.width = this.totalWidth() + 'px';
        this.scrollContentEl.style.height = this.totalHeight() + 'px';
    }

    /************************dataHand***************************/

    calculation():void{
        const {scrollTop,scrollLeft,boxWidth,boxHeight} = this;

        const {startRowIndex,endRowIndex,scrollOffsetTop} = this.findNearestItemIndex_row(scrollTop,scrollTop + boxHeight);
        const {startColIndex,endColIndex,scrollOffsetLeft} = this.findNearestItemIndex_col(scrollLeft,scrollLeft + boxWidth);

        this.startRowIndex = startRowIndex;
        this.endRowIndex = endRowIndex;
        this.startColIndex = startColIndex;
        this.endColIndex = endColIndex;
        this.scrollOffsetTop = scrollOffsetTop;
        this.scrollOffsetLeft = scrollOffsetLeft;
    }
    

    getRootRect():void{
        this.boxWidth = this.rootEl.clientWidth;
        this.boxHeight = this.rootEl.clientHeight;
    }

    handOption(): void{

        extend(this.option,setting,false);

        const rowLength:number = this.option.row.length;
        const rowMap:RowMap[] = this.option.row.map;
        const rowHeight:number = this.option.row.style.height;

        for(let r = 0; r < rowLength; r ++){
            rowMap[r] = rowMap[r] || {
                height: rowHeight,
                //update: true
            }
        }


        const colLength:number = this.option.col.length;
        const colMap:ColMap[] = this.option.col.map;
        const colWidth:number = this.option.col.style.width;

        for(let c = 0; c < colLength; c ++){
            colMap[c] = colMap[c] || {
                width: colWidth,
                filter: false,
                sort: false
            }
        }

        this.calculationRowHieght({
            startColIndex: 0, 
            endColIndex: this.option.col.length,
            startRowIndex: 0,
            endRowIndex: this.option.row.length,
        });

    }

    calculationRowHieght(config:{[prop:string]:any}):void{
        const {startColIndex,endRowIndex,startRowIndex,endColIndex} = config;
        const {option} = this;
        const rowMap:RowMap[] = option.row.map;
        const colMap:ColMap[] = option.col.map;
        const dataSet:Array<Array<Cell>> = option.dataSet;
        const styles = option.styles;
        const defaultStyle =option.cell.style;

        for(let r = startRowIndex; r < endRowIndex; r ++){
            let maxRowHieght = 0;
            for(let c = startColIndex; c < endColIndex; c ++){
                const cell = dataSet[r][c];
                const style = styles[cell.s] || defaultStyle;

                if(cell._width === undefined){
                    const result = getTextReact(cell,style,colMap[c].width);
                    cell._width = result.textWidth;
                    cell._height = result.textHeight;
                    cell._rows = result.rows;
                }
                maxRowHieght = Math.max(maxRowHieght,cell._height)
            }
            
            if(!rowMap[r].update){
                rowMap[r].height = Math.ceil(maxRowHieght + Span * 2);
            }
            
        }
    }

    findNearestItemIndex_row(scrollTop_strat:number,scrollTop_end:number): {startRowIndex:number,endRowIndex:number,scrollOffsetTop:number} {
        const {option} = this;
        const rowMap:RowMap[] = option.row.map;
        const rowLength:number = option.row.length;
        const fixedEnd:number = option.row.fixedEnd;
        let total = 0 , startRowIndex:number , endRowIndex:number = rowLength,scrollOffsetTop:number;

        for (let i = fixedEnd; i < rowLength; i++) {

            total += rowMap[i].height;

            if (startRowIndex === undefined && total >= scrollTop_strat) {
                startRowIndex = i;
                scrollOffsetTop = total - rowMap[i].height;
            }else if (total >= scrollTop_end) {
                endRowIndex = i;
                break;
            }
        }
        

        return {
            startRowIndex,
            endRowIndex: Math.min(endRowIndex + 1,option.row.length),
            scrollOffsetTop
        };
    }
    findNearestItemIndex_col(scrollLeft_strat:number,scrollLeft_end:number):{startColIndex:number,endColIndex:number,scrollOffsetLeft:number} {
        const {option} = this;
        const colMap:ColMap[] = option.col.map;
        const colLength:number = option.col.length;
        const fixedEnd:number = option.col.fixedEnd;
        let total = 0, startColIndex:number , endColIndex:number = colLength,scrollOffsetLeft:number;

        for (let i = fixedEnd; i < colLength; i++) {

            total += colMap[i].width;
            if (startColIndex === undefined && total >= scrollLeft_strat) {
                startColIndex = i;
                scrollOffsetLeft = total - colMap[i].width;
            }else if (total >= scrollLeft_end) {
                endColIndex = i;
                break;
            }
        }

        return {
            startColIndex,
            endColIndex:  Math.min(endColIndex + 1,option.col.length),
            scrollOffsetLeft
        };
    }

    getRowBarWidth():number{
        const rowWidth:number | string = this.option.row.style.width;
        const fontSize = this.option.row.style.fontSize;
        return (rowWidth === 'maxw' ? (String(this.option.row.length + 1).length * (fontSize - 2)) : rowWidth as number);
    }

    getRowOffsetWidth(fixedStart:number,fixedEnd:number):number{
        const {option} = this;
        const colMap:ColMap[] = option.col.map;
        // const fixedStart = option.col.fixedStart;
        // const fixedEnd = option.col.fixedEnd;

        // let max,min,negative;
        // if(fixedStart < fixedEnd){
        //     max = fixedEnd;
        //     min = fixedStart;
        //     negative = 1;
        // }else{
        //     max = fixedStart;
        //     min = fixedEnd;
        //     negative = -1;
        // }

        let total = 0;
        for(let i = fixedStart; i < fixedEnd; i ++){
            total += colMap[i].width;
        }
        return total;
    }

    getColOffsetHeight(fixedStart:number,fixedEnd:number):number{
        const {option} = this;
        const rowMap:RowMap[] = option.row.map;
        // const fixedStart = option.row.fixedStart;
        // const fixedEnd = option.row.fixedEnd;
        // let max,min,negative;
        // if(fixedStart < fixedEnd){
        //     max = fixedEnd;
        //     min = fixedStart;
        //     negative = 1;
        // }else{
        //     max = fixedStart;
        //     min = fixedEnd;
        //     negative = -1;
        // }

        let total = 0;
        for(let i = fixedStart; i < fixedEnd; i ++){
            total += rowMap[i].height;
        }
        return total;
    }

    //总高
    totalHeight():number{
        const rowMap = this.option.row.map;
        const fixedEnd = this.option.row.fixedEnd;
        let total = 0;
        for (let i = fixedEnd, j = rowMap.length; i < j; i++) {
            total += rowMap[i].height;
        }
        return total + this.fixedOffsetTop;
    }

    //总宽
    totalWidth():number{
        const colMap = this.option.col.map;
        const fixedEnd = this.option.col.fixedEnd;
        let total = 0;
        for (let i = fixedEnd, j = colMap.length; i < j; i++) {
            total += colMap[i].width;
        }
        return total + this.fixedOffsetLeft;
    }
}

const dataSet:any = [] , rows = 500 , cols = 500;
for(let r = 0; r < rows; r ++){
    dataSet[r] = [];
    for(let c = 0; c < cols; c ++){
        dataSet[r].push({
            w: r % 2 === 0 ? `ABC阿西吧${r}-${c}efg` : `${r}-${c}`,
            //s: r % 4,
            tt:2
        })
    
    }
}

(<any>window).sheet = new XSheet('#box',{
    dataSet,
    row:{
        length: rows,
        fixedStart: 0,
        fixedEnd: 0
    },
    col:{
        length: cols,
        fixedStart: 0,
        fixedEnd: 0
    }
})

export default XSheet;
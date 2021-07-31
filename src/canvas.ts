
import XSheet from './index';
import {getCenterGrid,createCellPos,getBorderStyle,getTextReact,LineHeight,Span} from './utils';
const log = console.log;
interface BgfcMap{
    [prop:string]: {
        bgList: Array<{s:CellStyle,x:number,y:number,w:number,h:number}>,
        fcList: Array<{
            s:CellStyle,
            t: unknown,
            x1:number,
            y1:number,
            x2:number,
            y2:number,
            textWidth:number,
            textHeight:number,
            rows: Array<{text:string,width:number}>
        }>
    }
}

interface BorderMap{
    [prop:string]: Array<{
        s:CellStyle,
        t: 'top' | 'left' | 'bottom' | 'right'
        x1:number,y1:number,x2:number,y2:number
    }>
}

//TODO 无法放到外部
enum Direction {
    init = -1,
    unchanged = 0,
    top,
    bottom,
    left,
    right,
    bottomLeft,
    bottomRight,
    topLeft,
    topRight,
}

export default class Canvas{


    static log = log;
    //画布元素
    canvas: HTMLCanvasElement;
    oldCanvas: HTMLCanvasElement;
    tableCanvas: HTMLCanvasElement;
    //实例
    context: XSheet;
    //画布上下文
    ctx: CanvasRenderingContext2D;
    oldCtx: CanvasRenderingContext2D;
    tableCtx: CanvasRenderingContext2D;
    //旧的滚动信息
    oldScrollTop: number;
    oldScrollLeft: number;

    oldStartColIndex: number;
    oldEndColIndex:number;
    oldStartRowIndex:number;
    oldEndRowIndex:number;

    constructor(context: XSheet){

        this.context = context;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.oldCanvas = document.createElement('canvas');
        this.oldCtx = this.oldCanvas.getContext('2d');

        this.tableCanvas = document.createElement('canvas');
        this.tableCtx = this.tableCanvas.getContext('2d');
        
        this.initCanvas(context.boxWidth,context.boxHeight);

        context.rootEl.appendChild(this.canvas);
        context.rootEl.appendChild(this.oldCanvas);
        context.rootEl.appendChild(this.tableCanvas);
        
    }

    moveTo(x:number,y:number,ctx:CanvasRenderingContext2D = this.ctx):void{
        ctx.moveTo(x+0.5,y + 0.5)
    }
    lineTo(x:number,y:number,ctx:CanvasRenderingContext2D = this.ctx):void{
        ctx.lineTo(x+0.5,y + 0.5)
    }

    render():void{
        //this.clearCanvas();

        const {ctx,tableCtx} = this;
        const {option,boxHeight,boxWidth,rowBarWidth} = this.context;
        const {fixedOffsetLeft,fixedOffsetTop,scrollTop,scrollLeft,scrollOffsetTop,scrollOffsetLeft} = this.context;
        const {startColIndex,endRowIndex,startRowIndex,endColIndex} = this.context;
        const colHeight = option.col.style.height;
        const fixedLineColor = option.canvas.fixedLineColor;
        const fixedLineWidth = option.canvas.fixedLineWidth;

        const rowConfig = option.row;
        const colConfig = option.col;
        const direction = this.getScrollDirection();

        this.calculationRowHieght({
            startColIndex: colConfig.fixedStart, 
            endColIndex: colConfig.fixedEnd,
            startRowIndex: rowConfig.fixedStart,
            endRowIndex: rowConfig.fixedEnd,
        });

        const requst = this.diffCanvas(direction,0,0);
        this.calculationRowHieght(requst);


        if(this.oldScrollLeft !== scrollLeft){
            ctx.clearRect(fixedOffsetLeft + 1, 0, boxWidth, fixedOffsetTop);
            this.calculationPermutation({
                startColIndex, 
                endColIndex,
                startRowIndex: rowConfig.fixedStart,
                endRowIndex: rowConfig.fixedEnd,
                offsetLeft: scrollOffsetLeft + fixedOffsetLeft,
                offsetTop: colHeight,
            },(bgffColorMap,borderMap)=>{
        
                ctx.save();
                ctx.rect(fixedOffsetLeft, 0, boxWidth, fixedOffsetTop + 1);//解决底线消失问题
                ctx.clip();
                ctx.translate(-scrollLeft,0);
    
                this.renderTopTh({
                    startColIndex,
                    endColIndex,
                    offsetLeft: fixedOffsetLeft + scrollOffsetLeft,
                    fixedOffsetLeft
                });
                this.renderTable(bgffColorMap,borderMap)
    
                ctx.restore();
    
            });
        }
    
        if(this.oldScrollTop !== scrollTop){
            ctx.clearRect(0, fixedOffsetTop + 1, fixedOffsetLeft, boxHeight);
            this.calculationPermutation({
                startColIndex: colConfig.fixedStart, 
                endColIndex: colConfig.fixedEnd,
                startRowIndex,
                endRowIndex,
                offsetLeft: rowBarWidth,
                offsetTop: scrollOffsetTop + fixedOffsetTop,
            },(bgffColorMap,borderMap)=>{
        
                ctx.save();
                ctx.rect(0, fixedOffsetTop, fixedOffsetLeft + 1, boxHeight);//解决底线消失问题
                ctx.clip();
                ctx.translate(0,-scrollTop);
                this.renderLeftTh({
                    startRowIndex,
                    endRowIndex,
                    offsetTop: fixedOffsetTop + scrollOffsetTop,
                    fixedOffsetTop
                });
                this.renderTable(bgffColorMap,borderMap)
    
                ctx.restore();
    
            });
        }

        //set none dont renderLine  改为renderTable
        // const isRenderInnerBorder = option.canvas.innerBorderColor !== 'none';
        // isRenderInnerBorder && this.renderGridLine();
       
        ctx.clearRect(fixedOffsetLeft + 1, fixedOffsetTop + 1, boxWidth, boxHeight);
        tableCtx.clearRect(0,0,boxWidth, boxHeight);
       

        this.calculationPermutation(requst,(bgffColorMap,borderMap)=>{
            //获取之前去除的部分
            if(direction === Direction.bottom){
                const oldHeight = this.context.getColOffsetHeight(this.oldStartRowIndex,startRowIndex);    
                tableCtx.drawImage(this.oldCanvas,0,-oldHeight);
                tableCtx.clearRect(0,requst.offsetTop,boxWidth, rowConfig.map[this.oldEndRowIndex - 1].height);
            }else if(direction === Direction.top){
                const oldHeight = this.context.getColOffsetHeight(startRowIndex,this.oldStartRowIndex);    
                tableCtx.drawImage(this.oldCanvas,0,oldHeight);
            }

            if(direction === Direction.right){
                const oldWidth = this.context.getRowOffsetWidth(this.oldStartColIndex,startColIndex);    
                tableCtx.drawImage(this.oldCanvas,-oldWidth,0);
                tableCtx.clearRect(requst.offsetLeft,0,colConfig.map[this.oldEndColIndex - 1].width, boxWidth);
            }else if(direction === Direction.left){
                const oldWidth = this.context.getRowOffsetWidth(startColIndex,this.oldStartColIndex);    
                tableCtx.drawImage(this.oldCanvas,oldWidth,0);
            }

            if(direction === Direction.bottomRight){
                
            }


            this.renderTable(bgffColorMap,borderMap,tableCtx);
            
            ctx.save();
            ctx.rect(fixedOffsetLeft, fixedOffsetTop, boxWidth, boxHeight);
            ctx.clip();

            ctx.translate(-scrollLeft,-scrollTop);
      

            ctx.drawImage(this.tableCanvas,fixedOffsetLeft + scrollOffsetLeft,fixedOffsetTop + scrollOffsetTop)

            ctx.restore();

        });


        //固定线
        ctx.strokeStyle = fixedLineColor;
        ctx.lineWidth = fixedLineWidth;
        if(colConfig.fixedEnd){
            ctx.beginPath();
            this.moveTo(fixedOffsetLeft, 0);
            this.lineTo(fixedOffsetLeft, boxHeight);
            ctx.stroke();
        }


        //固定线
        if(rowConfig.fixedEnd){
            ctx.beginPath();
            this.moveTo(0, fixedOffsetTop);
            this.lineTo(boxWidth, fixedOffsetTop);
            ctx.stroke();
        }

        this.oldScrollTop = scrollTop;
        this.oldScrollLeft = scrollLeft;

        this.copyCanvas();

    }

    copyCanvas(): void{

        Promise.resolve().then(()=>{
            const {boxHeight,boxWidth} = this.context;

            //const offsetLeft = this.context.getRowOffsetWidth(this.oldStartColIndex || 0,this.context.startColIndex);
            //const offsetTop = this.context.getColOffsetHeight(this.oldStartRowIndex || 0,this.context.startRowIndex);
    
            this.oldCtx.clearRect(0, 0, boxWidth, boxHeight);
            this.oldCtx.drawImage(this.tableCanvas,0,0);

            const {startRowIndex,endRowIndex} = this.context.findNearestItemIndex_row(this.context.scrollTop,this.context.scrollTop + boxHeight);
            const {startColIndex,endColIndex} = this.context.findNearestItemIndex_col(this.context.scrollLeft,this.context.scrollLeft + boxWidth);
            
            this.oldStartColIndex = startColIndex;
            this.oldEndColIndex = endColIndex;
            this.oldStartRowIndex = startRowIndex;
            this.oldEndRowIndex = endRowIndex;
        })
    }

    diffCanvas(direction:Direction,left:number,top:number): {[porp: string]: number} {

        let startRowIndex,endRowIndex,startColIndex,endColIndex,offsetLeft = left,offsetTop = top;

        switch (direction){
        case Direction.init:

            startRowIndex = this.oldEndRowIndex || 0;
            endRowIndex = this.context.endRowIndex;
            startColIndex = this.oldEndColIndex || 0;
            endColIndex = this.context.endColIndex;
            offsetLeft += this.context.getRowOffsetWidth(this.context.startColIndex || 0,this.oldEndColIndex - 3 || 0)
            offsetTop += this.context.getColOffsetHeight(this.context.startRowIndex || 0,this.oldEndRowIndex - 3 || 0)
            break;  
        case Direction.right:
            startRowIndex = this.context.startRowIndex;
            endRowIndex = this.context.endRowIndex;
            startColIndex = Math.max((this.oldEndColIndex || 0) - 3,0);
            endColIndex = this.context.endColIndex;
            offsetLeft += this.context.getRowOffsetWidth(this.context.startColIndex || 0,this.oldEndColIndex - 3 || 0)
            offsetTop += 0
            break;
        case Direction.left:
            startRowIndex = this.context.startRowIndex;
            endRowIndex = this.context.endRowIndex;
            startColIndex = this.context.startColIndex;
            endColIndex = this.oldStartColIndex;
            offsetLeft += 0;
            offsetTop += 0
            break;    
        case Direction.bottom:
            startRowIndex = Math.max((this.oldEndRowIndex || 0) - 3,0);
            endRowIndex = this.context.endRowIndex;
            startColIndex = this.context.startColIndex;
            endColIndex = this.context.endColIndex;
            offsetLeft += 0;
            offsetTop += this.context.getColOffsetHeight(this.context.startRowIndex || 0,this.oldEndRowIndex - 3 || 0)
            break;
        case Direction.top:
            startRowIndex = this.context.startRowIndex
            endRowIndex = this.oldStartRowIndex;
            startColIndex = this.context.startColIndex;
            endColIndex = this.context.endColIndex;
            offsetLeft += 0;
            offsetTop += 0;
            break;    
        case Direction.bottomRight:
            startRowIndex = 0;
            endRowIndex = 0;
            startColIndex = 0;
            endColIndex = 0; 
            offsetLeft = 0;
            offsetTop = 0;
            break;
        default:
            startRowIndex = 0;
            endRowIndex = 0;
            startColIndex = 0;
            endColIndex = 0;
            offsetLeft = 0;
            offsetTop = 0; 
        }

        return {
            startRowIndex,
            endRowIndex,
            startColIndex,
            endColIndex,
            offsetLeft,
            offsetTop,
        }
    }

    clearCanvas(): void{
        const {ctx} = this;
        const {boxHeight,boxWidth} = this.context;
        ctx.clearRect(0, 0, boxWidth, boxHeight);
    }

    initCanvas(width:number,height:number):void{

        const {ctx} = this;
        const bgColor:string = this.context.option.canvas.background;
        
        //basic attr
        this.tableCanvas.width = this.oldCanvas.width = this.canvas.width = width;
        this.tableCanvas.height = this.oldCanvas.height = this.canvas.height = height;

        // this.oldCanvas.style.cssText = 'position:absolute;left: 100%;top: 100%;';

        // this.canvas.style.width = width + 'px';
        // this.canvas.style.height = height + 'px';
        
        //set background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
    }

    renderFixedTable():void{
        const {option,rowBarWidth} = this.context;
        const colHeight = option.col.style.height;

        const rowConfig = option.row;
        const colConfig = option.col;

        //fixed
        this.renderLeftTh({
            startRowIndex: rowConfig.fixedStart,
            endRowIndex: rowConfig.fixedEnd,
            offsetTop: colHeight,
            fixedOffsetTop: 0
        });

        this.renderTopTh({
            startColIndex: colConfig.fixedStart,
            endColIndex: colConfig.fixedEnd,
            offsetLeft: rowBarWidth,
            fixedOffsetLeft: 0
        });

        if(colConfig.fixedEnd || rowConfig.fixedEnd){
            this.calculationPermutation({
                startColIndex:colConfig.fixedStart,
                endColIndex:colConfig.fixedEnd,
                endRowIndex: rowConfig.fixedEnd,
                startRowIndex: rowConfig.fixedStart,
                offsetLeft: rowBarWidth,
                offsetTop: colHeight,
            },this.renderTable.bind(this))
        }
    }
    
    calculationRowHieght(config:{[prop:string]:any}):void{
        const {startColIndex,endRowIndex,startRowIndex,endColIndex} = config;
        const {option} = this.context;
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

    calculationPermutation(config:{[prop:string]:any,bgffColorMap?:BgfcMap,borderMap?:BorderMap},callback:(bgffColorMap:BgfcMap,borderMap:BorderMap)=>void):void{
        const {startColIndex,endRowIndex,startRowIndex,endColIndex,offsetLeft,offsetTop,bgffColorMap = {},borderMap = {}} = config;
        const {option} = this.context;
        const rowMap:RowMap[] = option.row.map;
        const colMap:ColMap[] = option.col.map;
        const dataSet:Array<Array<Cell>> = option.dataSet;
        const styles = option.styles;
        const defaultStyle = option.cell.style;
        const borderColor:string = option.canvas.innerBorderColor;
        const guideKey = `solid,${borderColor},1`;

        let totalh:number = offsetTop, totalw:number;

        borderMap[guideKey] = [];
        
        for(let r = startRowIndex; r < endRowIndex; r ++){
            const oTotalh = totalh;
            totalw = offsetLeft;
            totalh += rowMap[r].height;
            for(let c = startColIndex; c < endColIndex; c ++){
                const cell = dataSet[r][c];
                const oTotalw = totalw;
                const style = styles[cell.s] || defaultStyle;

                totalw += colMap[c].width;
        
                bgffColorMap[style.bc] = bgffColorMap[style.bc] || {
                    bgList:[],
                    fcList:[]
                };

                bgffColorMap[style.bc].bgList.push({
                    s: style,
                    x: oTotalw, 
                    y: oTotalh, 
                    w: colMap[c].width, 
                    h: rowMap[r].height
                });

                bgffColorMap[style.fc] = bgffColorMap[style.fc] || {
                    bgList:[],
                    fcList:[]
                };

                bgffColorMap[style.fc].fcList.push({
                    s: style,
                    t: cell.w,
                    x1: oTotalw,
                    x2: totalw,
                    y1: oTotalh,
                    y2: totalh,
                    textWidth: cell._width,
                    textHeight: cell._height,
                    rows: cell._rows
                });
                

                if(style.bl[0] === 'none'){
                    borderMap[guideKey].push({
                        t: 'left',
                        s:  style,
                        x1: oTotalw,
                        y1: oTotalh,
                        x2: totalw,
                        y2: totalh
                    })
                }else{
                    const _bl = style.bl.toString();
                    borderMap[_bl] = borderMap[_bl] || [];
                    borderMap[_bl].push({
                        t: 'left',
                        s:  style,
                        x1: oTotalw,
                        y1: oTotalh,
                        x2: totalw,
                        y2: totalh
                    });
                }
                
                if(style.bt[0] === 'none'){
                    borderMap[guideKey].push({
                        t: 'top',
                        s:  style,
                        x1: oTotalw,
                        y1: oTotalh,
                        x2: totalw,
                        y2: totalh
                    })
                }else{
                    const _bt = style.bt.toString();
                    borderMap[_bt] = borderMap[_bt] || [];
                    borderMap[_bt].push({
                        t: 'top',
                        s:  style,
                        x1: oTotalw,
                        y1: oTotalh,
                        x2: totalw,
                        y2: totalh
                    });
                }

                if(style.br[0] === 'none'){
                    borderMap[guideKey].push({
                        t: 'right',
                        s:  style,
                        x1: oTotalw,
                        y1: oTotalh,
                        x2: totalw,
                        y2: totalh
                    })
                }else{
                    const _br = style.br.toString();
                    borderMap[_br] = borderMap[_br] || [];
                    borderMap[_br].push({
                        t: 'right',
                        s:  style,
                        x1: oTotalw,
                        y1: oTotalh,
                        x2: totalw,
                        y2: totalh
                    });
                }
                
                if(style.bb[0] === 'none'){
                    borderMap[guideKey].push({
                        t: 'bottom',
                        s:  style,
                        x1: oTotalw,
                        y1: oTotalh,
                        x2: totalw,
                        y2: totalh
                    })
                }else{
                    const _bb = style.bb.toString();
                    borderMap[_bb] = borderMap[_bb] || [];
                    borderMap[_bb].push({
                        t: 'bottom',
                        s:  style,
                        x1: oTotalw,
                        y1: oTotalh,
                        x2: totalw,
                        y2: totalh
                    });
                }
            

                //下划线
                // if(style.u){
                //     const key = `solid,${style.fc},${style.b ? 2 : 1}`;
                //     borderMap[key] = borderMap[key] || [];
                //     borderMap[key].push({
                //         t: 'top',
                //         s:  style,
                //         x1: totalw,
                //         y1: totalh + style.fs / 2,
                //         x2: totalh + textRect.width,
                //         y2: null
                //     });
                // }

            }


        }

        callback(bgffColorMap,borderMap);

    }

    renderGridLine():void{
        const {ctx} = this;
        const {startColIndex,endRowIndex,startRowIndex,endColIndex,option,rowBarWidth} = this.context;
        const {fixedOffsetLeft,fixedOffsetTop,scrollLeft,scrollTop,scrollOffsetLeft,scrollOffsetTop} = this.context;
        const rowMap:RowMap[] = option.row.map;
        const rowFixedStart = option.row.fixedStart;
        const rowFixedEnd = option.row.fixedEnd;
        const colMap:ColMap[] = option.col.map;
        const colFixedStart = option.col.fixedStart;
        const colFixedEnd = option.col.fixedEnd;

        const colHeight = option.col.style.height;
        const borderColor:string = option.canvas.innerBorderColor;
        const boxWidth:number = this.context.boxWidth , boxHeight:number = this.context.boxHeight;
        

        const lineWidth = boxWidth + scrollLeft , lineHeight = boxHeight + scrollTop;

        ctx.strokeStyle = borderColor;
        let totalh = colHeight , totalw = rowBarWidth;

        //row
        ctx.beginPath();
        this.moveTo(0, colHeight);
        this.lineTo(lineWidth, colHeight);
        //fixed
        for(let r = rowFixedStart; r < rowFixedEnd; r++){
            totalh += rowMap[r].height;
            this.moveTo(0, totalh);
            this.lineTo(lineWidth, totalh);
        }

        //col
        this.moveTo(rowBarWidth, 0);
        this.lineTo(rowBarWidth, lineHeight);
        //fixed
        for(let c = colFixedStart; c < colFixedEnd; c++){
            totalw += colMap[c].width;
            this.moveTo(totalw, 0);
            this.lineTo(totalw, lineHeight);
        }

        ctx.save();
        ctx.translate(-scrollLeft,-scrollTop);

        //table
        totalh = fixedOffsetTop + scrollOffsetTop , totalw = fixedOffsetLeft + scrollOffsetLeft;
        for(let r = startRowIndex; r < endRowIndex; r++){
            totalh += rowMap[r].height;
            this.moveTo(0, totalh);
            this.lineTo(lineWidth, totalh);
        }
        for(let c = startColIndex; c < endColIndex; c++){
            totalw += colMap[c].width;
            this.moveTo(totalw, 0);
            this.lineTo(totalw, lineHeight);
        }

        ctx.stroke();
        ctx.restore();
    }

    renderTopTh(config:{[prop:string]:any}): void{
        const {ctx} = this;
        const {startColIndex,endColIndex,offsetLeft,fixedOffsetLeft} = config;
        const {option} = this.context;
       
        const fontSize:number = option.col.style.fontSize;
        const fontFamily:string = option.col.style.fontFamily;
        const fontColor:string = option.col.style.fontColor;
        const colMap:ColMap[] = option.col.map;
        const colHeight = option.col.style.height;
        const borderColor:string = option.canvas.innerBorderColor;

        ctx.fillStyle = fontColor;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        let totalw = offsetLeft;
        for(let c = startColIndex; c < endColIndex; c ++){
            const oTotal = totalw;
            totalw += colMap[c].width;
           
            const {x,y} = getCenterGrid({
                x1: oTotal,
                x2: totalw,
                y1: 0,
                y2: colHeight,
            });
            ctx.fillText(createCellPos(c), x, y);
            
        }

        //封底线
        ctx.strokeStyle = borderColor;
        ctx.beginPath();
        this.moveTo(fixedOffsetLeft, colHeight);
        this.lineTo(totalw, colHeight);
        ctx.stroke();

    }

    renderLeftTh(config:{[prop:string]:any}):void{
        const {ctx} = this;
        const {startRowIndex,endRowIndex,offsetTop,fixedOffsetTop} = config;
        const {option,rowBarWidth} = this.context;
        const {fixedOffsetLeft} = this.context;
        const fontSize:number = option.row.style.fontSize;
        const fontFamily:string = option.row.style.fontFamily;
        const fontColor:string = option.row.style.fontColor;
        const borderColor:string = option.canvas.innerBorderColor;
        const rowMap:RowMap[] = option.row.map;
        const rowWidth:number = rowBarWidth;

        ctx.fillStyle = fontColor;
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let totalh = offsetTop;
        for(let r = startRowIndex; r < endRowIndex; r ++){
            const oTotal = totalh;
            totalh += rowMap[r].height;

            const {x,y} = getCenterGrid({
                x1: 0,
                x2: rowWidth,
                y1: oTotal,
                y2: totalh,
            });
            ctx.fillText(String(r + 1), x, y);
            
        }

       
        //封底线
        ctx.strokeStyle = borderColor;
        ctx.beginPath();
        this.moveTo(fixedOffsetLeft, fixedOffsetTop);
        this.lineTo(fixedOffsetLeft, totalh);
        ctx.stroke();

    }

    renderTable(bgffColorMap:BgfcMap,borderMap:BorderMap,ctx = this.ctx):void{
        //const {ctx} = this;

        ctx.textBaseline = 'hanging';
        ctx.textAlign = 'left';

        for(const color in bgffColorMap){
            const bgList = bgffColorMap[color].bgList;
            const fcList = bgffColorMap[color].fcList;

            ctx.fillStyle = color;

            for(let i = 0 , length = bgList.length; i < length; i ++){
                const item = bgList[i];
                ctx.fillRect(item.x,item.y,item.w,item.h);
            }
             

            let startY,startX;
            for(let i = 0 , length = fcList.length; i < length; i ++){
                const item = fcList[i] , style = item.s;
                const addHeight = style.fs + style.fs * LineHeight;
                const mapKey = `solid,${style.fc},${style.b ? 2 : 1}`;
                borderMap[mapKey] = borderMap[mapKey] || [];

                if(style.v === 'top'){
                    startY = item.y1 + Span;
                }else if(style.v === 'bottom'){
                    startY = item.y2 - Span - item.textHeight;
                }else{
                    startY = item.y1 + (item.y2 - item.y1 - item.textHeight) / 2;
                }
     
                // ctx.save();
                //ctx.rect(item.x1, item.y1, item.x2 - item.x1, item.y2 - item.y1);
                //ctx.clip();                
                ctx.font = `${style.i ? 'italic' : ''} ${style.fs}px ${style.ff} ${style.b ? 'bold' : ''}`;
                
                for(let i = 0,length = item.rows.length; i < length; i++){

                    if(!item.rows[i].text) {
                        startY += addHeight ;
                        continue
                    }

                    if(style.a === 'left'){
                        startX = item.x1 + Span;
                    }else if(style.a === 'right'){
                        startX = item.x2 - item.rows[i].width - Span;
                    }else{
                        startX = item.x1 + (item.x2 - item.x1 - item.rows[i].width) / 2;
                    }
                
                    ctx.fillText(item.rows[i].text,startX,startY);

                    if(style.u){
                        borderMap[mapKey].push({
                            t: 'top',
                            s:  style,
                            x1: startX,
                            y1: startY + style.fs,
                            x2: startX + item.rows[i].width,
                            y2: startY + style.fs
                        });
                        //ctx.moveTo(startX,startY + style.fs);
                        //ctx.lineTo(startX + item.rows[i].width,startY + style.fs);
                    }
                    if(style.s){
                        borderMap[mapKey].push({
                            t: 'top',
                            s:  style,
                            x1: startX,
                            y1: startY + style.fs / 2,
                            x2: startX + item.rows[i].width,
                            y2: startY + style.fs / 2
                        });
                        //ctx.moveTo(startX,startY + style.fs / 2);
                        //ctx.lineTo(startX + item.rows[i].width,startY + style.fs / 2);
                    }
                
                    startY += addHeight ;
                }

                //ctx.restore();
                
                // ctx.fillText(item.t as string, item.x, item.y);
            }
        }

        for(const k in borderMap){
            const bconfig = k.split(',');

            if(bconfig[0] === 'none') continue;
           
            const list = borderMap[k];
            ctx.strokeStyle = bconfig[1];
            ctx.setLineDash(getBorderStyle(bconfig[0]));
            ctx.lineWidth = parseInt(bconfig[2]);
            ctx.beginPath();
 
            for(let i = 0 , length = list.length; i < length; i ++){
                const {t,x1,x2,y1,y2} = list[i];
                if(t === 'top'){
                    this.moveTo(x1, y1,ctx);
                    this.lineTo(x2, y1,ctx);
                }else if(t === 'bottom'){
                    this.moveTo(x1, y2,ctx);
                    this.lineTo(x2, y2,ctx); 
                }else if(t === 'left'){
                    this.moveTo(x1, y1,ctx);
                    this.lineTo(x1, y2,ctx);
                }else{
                    this.moveTo(x2, y1,ctx);
                    this.lineTo(x2, y2,ctx);
                }
            }
            ctx.stroke();
        }

    }


    /* *****************工具函数**************** */
    getScrollDirection():number{
        const {oldScrollLeft,oldScrollTop} = this;
        const {scrollLeft,scrollTop} = this.context;

        if(oldScrollLeft === undefined && oldScrollTop === undefined){
            return Direction.init
        }

        const Left = (oldScrollLeft || 0) - scrollLeft;
        const Top = (oldScrollTop || 0) - scrollTop;

        if(Left === 0 && Top > 0){
            return Direction.top;
        }else if(Left === 0 && Top < 0){
            return Direction.bottom;
        }else if(Top === 0 && Left > 0){
            return Direction.left;
        }else if(Top === 0 && Left < 0){
            return Direction.right;
        }else if(Top < 0 && Left < 0){
            return Direction.bottomRight;
        }else{
            return Direction.unchanged; 
        }

    }

}
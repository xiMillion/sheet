
import XSheet from './index';
import {getCenterGrid,createCellPos} from './utils';
const log = console.log;

export default class Canvas{

    static log = log;
    //画布元素
    canvas: HTMLCanvasElement;
    //实例
    context: XSheet;
    //画布上下文
    ctx: CanvasRenderingContext2D;

    constructor(context: XSheet){

        this.context = context;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.initCanvas(context.boxWidth,context.boxHeight);
        
    }

    render():void{
        this.clearCanvas();

        const {option} = this.context;
        //set none dont renderLine
        const isRenderInnerBorder = option.style.innerBorderColor !== 'none';
        isRenderInnerBorder && this.renderGridLine();
        
        this.renderTopTh();
        this.renderLeftTh();

        this.renderTable();

    }

    clearCanvas(): void{
        const {ctx} = this;
        const {boxHeight,boxWidth} = this.context;
        ctx.clearRect(0, 0, boxWidth, boxHeight);
    }

    initCanvas(width:number,height:number):void{

        const {ctx} = this;
        const bgColor:string = this.context.option.style.background;
        
        //basic attr
        this.canvas.width = width;
        this.canvas.height = height;
        
        //set background
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);
    }

    renderGridLine():void{
        const {ctx} = this;
        const {startColIndex,endRowIndex,startRowIndex,endColIndex,option} = this.context;
        const {fixedOffsetLeft,fixedOffsetTop,scrollLeft,scrollTop,scrollOffsetLeft,scrollOffsetTop} = this.context;
        const rowMap:RowMap[] = option.row.map;
        const colMap:ColMap[] = option.col.map;
        const borderColor:string = option.style.innerBorderColor;
        const boxWidth:number = this.context.boxWidth , boxHeight:number = this.context.boxHeight;
        
        const offsetLeft:number = fixedOffsetLeft + scrollOffsetLeft , offsetTop:number = fixedOffsetTop + scrollOffsetTop;

        ctx.save();
        ctx.translate(-scrollLeft,-scrollTop);
        ctx.strokeStyle = borderColor;
        ctx.beginPath();
        let totalh = offsetTop , totalw = offsetLeft;
        for(let r = startRowIndex; r < endRowIndex; r++){
            totalh += rowMap[r].height;
            ctx.moveTo(offsetLeft, totalh);
            ctx.lineTo(boxWidth + scrollLeft, totalh);
        }
        for(let c = startColIndex; c < endColIndex; c++){
            totalw += colMap[c].width;
            ctx.moveTo(totalw, offsetTop);
            ctx.lineTo(totalw, boxHeight + scrollTop);
        }
        ctx.stroke();
        ctx.restore();
    }

    renderTopTh():void{
        const {ctx} = this;
        const {option,startColIndex,endColIndex,boxWidth} = this.context;
        const {fixedOffsetLeft,fixedOffsetTop,scrollOffsetLeft,scrollLeft} = this.context;
        //const bgColor = option.style.col.bgColor;
        const fontSize:number = option.style.col.fontSize;
        const fontFamily:string = option.style.col.fontFamily;
        const fontColor:string = option.style.col.fontColor;
        const borderColor:string = option.style.innerBorderColor;
        const colMap:ColMap[] = option.col.map;
        const colHeight = option.style.col.height;
        //const fixedStart = option.row.fixedStart;
        //const fixedEnd = option.row.fixedEnd;

        ctx.save();
        ctx.rect(fixedOffsetLeft, 0, boxWidth, fixedOffsetTop);
        //ctx.clip();
        ctx.translate(-scrollLeft,0);
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = borderColor;
        ctx.fillStyle = fontColor;

        ctx.beginPath();

        let totalw = fixedOffsetLeft + scrollOffsetLeft;
        for(let c = startColIndex; c < endColIndex; c ++){
            const oTotal = totalw;
            totalw += colMap[c].width;
     
            ctx.moveTo(totalw, 0);
            ctx.lineTo(totalw, colHeight);
            ctx.stroke(); //可以去除

           
            const {x,y} = getCenterGrid({
                x1: oTotal,
                x2: totalw,
                y1: 0,
                y2: colHeight,
            });
            ctx.fillText(createCellPos(c), x, y);
            
        }
      
        ctx.restore();

        //封底线
        ctx.moveTo(fixedOffsetLeft, fixedOffsetTop);
        ctx.lineTo(totalw, fixedOffsetTop);
        ctx.stroke();

    }

    renderLeftTh():void{
        const {ctx} = this;
        const {option,startRowIndex,endRowIndex,rowBarWidth,boxHeight} = this.context;
        const {fixedOffsetLeft,fixedOffsetTop,scrollOffsetTop,scrollTop} = this.context;
        const fontSize:number = option.style.row.fontSize;
        const fontFamily:string = option.style.row.fontFamily;
        const fontColor:string = option.style.row.fontColor;
        const borderColor:string = option.style.innerBorderColor;
        const rowMap:RowMap[] = option.row.map;
        const rowWidth:number = rowBarWidth;
        const colHeight = option.style.col.height;

        ctx.save();
        ctx.rect(0, fixedOffsetTop, fixedOffsetLeft, boxHeight);
        ctx.clip();

        ctx.translate(0,-scrollTop);
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = borderColor;
        ctx.fillStyle = fontColor;
        ctx.beginPath();

        let totalh = fixedOffsetTop + scrollOffsetTop;
        for(let r = startRowIndex; r < endRowIndex; r ++){
            const oTotal = totalh;
            totalh += rowMap[r].height;
            ctx.moveTo(0, totalh);
            ctx.lineTo(rowWidth, totalh);
            ctx.stroke();

            const {x,y} = getCenterGrid({
                x1: 0,
                x2: rowWidth,
                y1: oTotal,
                y2: totalh,
            });
            ctx.fillText(String(r + 1), x, y);
            
        }

        ctx.restore();
        //封底线
        ctx.moveTo(fixedOffsetLeft, colHeight);
        ctx.lineTo(fixedOffsetLeft, totalh);
        ctx.stroke();

    }

    renderTable():void{
        const {ctx} = this;
        const {startColIndex,endRowIndex,startRowIndex,endColIndex,option,boxHeight,boxWidth} = this.context;
        const {fixedOffsetLeft,fixedOffsetTop,scrollOffsetLeft,scrollOffsetTop,scrollTop,scrollLeft} = this.context;
        const rowMap:RowMap[] = option.row.map;
        const colMap:ColMap[] = option.col.map;
        const dataSet:Array<Array<Cell>> = option.dataSet;
        const defaultStyle = option.style.cell;

        let totalh:number = scrollOffsetTop + fixedOffsetTop, totalw:number;

        ctx.save();

        ctx.rect(fixedOffsetLeft, fixedOffsetTop, boxWidth, boxHeight);
        ctx.clip();

        ctx.translate(-scrollLeft,-scrollTop);
        log(endRowIndex-startRowIndex,endColIndex-startColIndex)
        for(let r = startRowIndex; r < endRowIndex; r ++){
            const oTotalh = totalh;
            totalw = scrollOffsetLeft + fixedOffsetLeft;
            totalh += rowMap[r].height;

            for(let c = startColIndex; c < endColIndex; c ++){
                const cell = dataSet[r][c];
                const oTotalw = totalw;
                totalw += colMap[c].width;
           
                cell.s = cell.s || {
                    //背景色
                    bc: defaultStyle.background,
                    //字体颜色
                    fc: defaultStyle.color,
                    //字体大小
                    s: defaultStyle.fontSize,
                    //字体格式
                    f:defaultStyle.fontFamily,
                    //水平方式
                    a: defaultStyle.textAlign,
                    //垂直方式
                    v: defaultStyle.verticalAlign,
                    //粗体
                    b: defaultStyle.fontWeight,
                    //斜体
                    i: defaultStyle.fontStyle,
                    //下划线
                    u: defaultStyle.textDecoration,
                    //边框  style color width
                    bl: [defaultStyle.borderLeft[0],defaultStyle.borderLeft[1],defaultStyle.borderLeft[2]],
                    br: [defaultStyle.borderRight[0],defaultStyle.borderRight[1],defaultStyle.borderRight[2]],
                    bt: [defaultStyle.borderTop[0],defaultStyle.borderTop[1],defaultStyle.borderTop[2]],
                    bb: [defaultStyle.borderBottom[0],defaultStyle.borderBottom[1],defaultStyle.borderBottom[2]],
                    //斜线
                    ol: [defaultStyle.obliqueLeft[0],defaultStyle.obliqueLeft[1],defaultStyle.obliqueLeft[2]],
                    or: [defaultStyle.obliqueRight[0],defaultStyle.obliqueRight[1],defaultStyle.obliqueRight[2]],
                } as CellStyle;

                //background
                ctx.fillStyle = cell.s.bc;
                ctx.fillRect(oTotalw, oTotalh, colMap[c].width, rowMap[r].height);

                ctx.font = `${cell.s.s}px ${cell.s.f}`;
                ctx.textAlign = cell.s.a;
                ctx.textBaseline = cell.s.v;
                ctx.fillStyle = cell.s.fc;

                const {x,y} = getCenterGrid({
                    x1: oTotalw,
                    x2: totalw,
                    y1: oTotalh,
                    y2: totalh,
                });
                ctx.fillText(cell.w, x, y);
            }
        }

        ctx.restore();
    }

    
}

type attrObj = {[prop:string]: any};

const Span = 5;
const Canvas:HTMLCanvasElement = document.createElement("canvas");
const Ctx = Canvas.getContext("2d");

export const extend = function(tag: attrObj,source:attrObj,hasReplace = true):void{
   
    for(const k in source){
        if(typeof source[k] === 'object' && source[k] !== null){
           
            tag[k] = tag[k] ?? (Array.isArray(source[k]) ? [] : {});

            extend(tag[k],source[k],hasReplace)
        }else{
            if(hasReplace){
                tag[k] = source[k]
            }else{
                tag[k] = tag[k] ?? source[k];
            }
        }
    }
}

export const getCenterGrid = function(grid: Grid): {x:number,y:number}{
    return {
        x: grid.x1 + (grid.x2 - grid.x1) / 2,
        y: grid.y1 + (grid.y2 - grid.y1) / 2
    }
}

export const getGridPosition = function(grid: Grid,align:AlignType,vertical: Vertical): {x:number,y:number} {
    let x:number, y:number;

    if(align === 'left'){
        x = grid.x1 + Span;
    }else if(align === 'right'){
        x = grid.x2 - Span;
    }else{
        x = grid.x1 + (grid.x2 - grid.x1) / 2;
    }

    if(vertical === 'top'){
        y = grid.y1 + Span;
    }else if(vertical === 'alphabetic'){
        y = grid.y2 - Span;
    }else{
        y = grid.y1 + (grid.y2 - grid.y1) / 2;
    }

    return {x,y}
}

//10进制转为26进制字母
export const createCellPos = function (n:number):string {
    const ordA = 'A'.charCodeAt(0);
    const ordZ = 'Z'.charCodeAt(0);
    const len = ordZ - ordA + 1;
    let s = "";
    while( n >= 0 ) {
  
        s = String.fromCharCode(n % len + ordA) + s;
  
        n = Math.floor(n / len) - 1;
  
    }
    return s;
};

export const getBorderStyle = function(type:string): [number,number] {
    if(type === 'dadwad'){
        return [2,2]
    }else if(type === 'dashed'){
        return [3,2]
    }else{
        return [0,0]
    }
}

function getTextRow(value:string,boxWidth:number,font:string):number {
    Ctx.font = font;
  
    let row = 1;
    let lineWidth = 5;
  
    if(boxWidth <= 0){
        return 1;
    }
  
    for(let i = 0; i < value.length; i ++) {
        lineWidth += Ctx.measureText(value[i]).width;
  
        if (lineWidth > boxWidth) {
            lineWidth = 5;
            row ++;
            i -= 1;
        }else if(/[\n]/.test(value[i])){
            lineWidth = 5;
            row ++;
        }
    }
  
    return row
}
  
function getTextWidth(value:string, font:string):number {
    if(!value) return 0;
    Ctx.font = font;
    const metrics = Ctx.measureText(value);
  
    return metrics.width
  
}

//通过文字长度，宽度，size 模拟 高度,宽度
export const getTextReact = function (cell:Cell,style:CellStyle,width:number): {width:number,height:number} {
    const value = cell.w;
    const isbreak = cell.tt === 2 || /[\r|\n]/.test(value);
    const font = `${style.fs}px ${style.ff} ${style.b ? 'bold' : ''}`;
  
    if(!isbreak){
        return {
            width: getTextWidth(value,font),
            height: Math.max(style.fs + Span,22)
        }
  
    }else{
        const rows = getTextRow(value,width - Span,font);
        return {
            width: width - Span,
            height: rows * style.fs + Span
        }
    }
}
  

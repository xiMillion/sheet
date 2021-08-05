
type attrObj = {[prop:string]: any};

export const Span = 5;
export const LineHeight = 0.3;
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
    }else if(vertical === 'bottom'){
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


//通过文字长度，宽度，size 模拟 高度,宽度
export const getTextReact = function (cell:Cell,style:CellStyle,cellWidth:number): {textHeight:number,textWidth:number,rows: Array<{text: string,width:number}>} {
    
    const value:string = cell.w , rows = [] , fontSize = style.fs;

    if(!value || cellWidth < 1) return {
        rows:[],
        textHeight: fontSize,
        textWidth: 0
    };

    let str = '' , total = Span * 2;
    Ctx.font = `${style.i ? 'italic' : ''} ${style.fs}px ${style.ff} ${style.b ? 'bold' : ''}`
    if(cell.tt === 2){
        for(let i = 0, length = value.length; i < length; i ++){
            const s = value[i];
            const w = Ctx.measureText(s).width;
            total += w;
            if(total > cellWidth || s === '\n'){
                rows.push({
                    text: str,
                    width: total - w - Span * 2
                });
                total = Span * 2 + w;
                str = s;
            }else{
                str += s;
            }
        
        }

        if(str){
            rows.push({
                text: str,
                width: total - Span * 2
            });
        }

        return {
            rows,
            textHeight: fontSize * rows.length + LineHeight * fontSize * (rows.length - 1),
            textWidth: cellWidth
        }
    }else{
        const textw = Ctx.measureText(value).width;
        return {
            rows:[{
                text:value,
                width: textw
            }],
            textHeight: fontSize,
            textWidth: textw
        }
    }
}
  

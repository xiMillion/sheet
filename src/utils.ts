
type attrObj = {[prop:string]: any};

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
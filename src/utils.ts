
type attrObj = {[prop:string]: any};

export const extend = function(tag: attrObj,source:attrObj):void{
    for(const k in source){
        if(typeof source[k] === 'object' && source[k] !== null){
            if(!tag[k]){
                tag[k] = Array.isArray(source[k]) ? [] : {};
            }
            extend(tag[k],source[k])
        }else{
            tag[k] = tag[k] ?? source[k];
        }
    }
}


interface OPTION {
     //模式  默认 edit  只读 readonly
    mode?: string,
    //行配置
    row?: ROW,
    //列配置
    col?: COL,
    //数据
    dataSet?: Array<Array<CELL>>,
}

export interface ROW{
    //初始行数
    length?: number,
    //行高
    height?: number,
    //拖动以及设置最小高
    minHeight?: number,
    //左侧表头宽  auto、maxw、number(px)
    width?: string | number,
    //具体
    map?: Array<ROWMAP>,
    //冻结行开始
    fixedStart?: number,
    //冻结行结束
    fixedEnd?: number,
    //自动延展
    extension?: boolean
}

export interface ROWMAP{
    //高度
    height: number
}

export interface COL{
    //初始列数
    length?: number,
    //列宽
    width?: number,
    //拖动以及设置最小宽
    minWidth?: number,
    //上侧表头高  number(px)
    height?: number,
    //具体
    map?: Array<COLMAP>,
    //冻结行开始
    fixedStart?: number,
    //冻结行结束
    fixedEnd?: number,
    //自动延展
    extension?: boolean
}

export interface COLMAP{
    //宽度
    height: number,
    //启用筛选
    filter: boolean,
    //启用排序
    sort:boolean
}

export interface CELL{
    //原始值
    v: unknown,
    //展示文本值
    w: unknown,
    //公式值
    f: unknown,
    //样式对象
    s: STYLE,
    //展现类型  text\image\select\date\chart\
    t: 'text',
    //格式化
    m: 'txt'
}

export interface STYLE{
    //背景色
    bc?: string,
    //字体颜色
    fc?: string,
    //字体大小
    s?: 12,
    //字体格式
    f?:string,
    //水平方式
    a?: string,
    //垂直方式
    v?: string,
    //粗体
    b?: boolean,
    //斜体
    i?: boolean,
    //下划线
    u?: boolean,
    //边框  style color width
    bl:[string,string,number],
    br: [string,string,number],
    bt: [string,string,number],
    bb: [string,string,number],
    //斜线
    ol: [string,string,number],
    or: [string,string,number],

    //字符展现形式 0-超出截断  1-溢出  2-换行
    tt: 0 | 1 | 2,
}

export default OPTION;
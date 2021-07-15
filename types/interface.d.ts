

declare interface Option {
     //模式  默认 edit  只读 readonly  禁用 disable
    mode?: 'edit' | 'readonly',
    //单元格启用富文本
    rich?: boolean,
    //行配置
    row?: Row,
    //列配置
    col?: Col,
    //单元格
    cell?: CellOption,
    //数据
    dataSet?: Array<Array<Cell>>,
    //选区
    region?: Region,
    //画布配置
    canvas?:{
        //画布背景
        background?: string,
        //画布外边框
        outBorderColor?: string,
        //画布内边框颜色
        innerBorderColor?: string,
        //固定行列样式
        fixedLineColor?:string,
        fixedLineWidth?:number
    },
    //样式列表
    styles?: Array<CellStyle>
}

declare interface Row{
    //初始行数
    length?: number,
    //具体
    map?: Array<RowMap>,
    //冻结行开始
    fixedStart?: number,
    //冻结行结束
    fixedEnd?: number,
    //自动延展
    extension?: boolean,
    //样式
    style?: RowStyle
}

declare interface RowMap{
    //高度
    height: number,
    //是否改变
    update?: boolean
}

declare interface Col{
    //初始列数
    length?: number,
    //具体
    map?: Array<ColMap>,
    //冻结行开始
    fixedStart?: number,
    //冻结行结束
    fixedEnd?: number,
    //自动延展
    extension?: boolean,
    //样式
    style?: ColStyle
}

declare interface ColMap{
    //宽度
    width: number,
    //启用筛选
    filter: boolean,
    //启用排序
    sort:boolean
}

declare interface Cell{
    //原始值
    v: unknown,
    //展示文本值
    w: string,
    //公式值
    f: unknown,
    //样式索引
    s: number,
    //展现类型  text\image\select\date\chart\
    t: CellType,
    //格式化 
    m: 'txt',
    //字符展现形式 0-超出截断  1-溢出  2-换行
    tt: 0 | 1 | 2,
    //是否只读
    ry: number,
    //宽度
    _width?: number
    //高度,
    _height?: number,
    //行map
    _rows: Array<{text:string,width:number}>
}

declare interface CellOption{
    //默认显示文字
    value?: unknown,
    //展示文本
    weitex?: string,
    //公式
    formula?:unknown,
    //默认格式
    type?: string,
    //格式化 0-常规
    format?: number,
    //字符展现形式 0-超出截断  1-溢出  2-换行
    txtFormType?: 0 | 1 | 2,
    //只读
    readonly?:number,
    //样式
    style?: CellStyle
}

declare interface CellStyle{
    //背景色
    bc: string,
    //字体颜色
    fc: string,
    //字体大小
    fs: number,
    //字体格式
    ff:string,
    //水平方式
    a: AlignType,
    //垂直方式
    v: Vertical,
    //粗体
    b: number,
    //斜体
    i: number,
    //下划线
    u: number,
    //中划线
    s: number,
    //边框  style color width
    bl:[string,string,number],
    br: [string,string,number],
    bt: [string,string,number],
    bb: [string,string,number],
    //斜线
    ol: [string,string,number],
    or: [string,string,number],
}

declare interface Region{
    sr: number,
    sc: number,
    er: number,
    ec: number
}

declare interface Grid{
    x1: number,
    x2: number,
    y1: number,
    y2: number
}

declare interface RowStyle{
    //字体大小
    fontSize?: number,
    //字体颜色
    fontColor?: string,
    //格式
    fontFamily: string,
    //行高
    height?: number,
    //拖动以及设置最小高
    minHeight?: number,
    //左侧表头宽  auto、maxw、number(px)
    width?: number | string,
}

declare interface ColStyle{
    //字体大小
    fontSize?: number,
    //字体颜色
    fontColor?: string,
    //格式
    fontFamily?: string,
    //列宽
    width?: number,
    //拖动以及设置最小宽
    minWidth?: number,
    //上侧表头高  number(px)
    height?: number,
}
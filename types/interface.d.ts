

declare interface Option {
     //模式  默认 edit  只读 readonly
    mode?: 'edit' | 'readonly',
    //行配置
    row?: Row,
    //列配置
    col?: Col,
    //数据
    dataSet?: Array<Array<Cell>>,
     //单元格启用富文本
    rich?: boolean,
    //整体样式
    style?: Style,
    //单元格
    cell?: CellOption,
    //选区
    region?: Region,
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
    extension?: boolean
}

declare interface RowMap{
    //高度
    height: number
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
    extension?: boolean
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
    //样式对象
    s: CellStyle,
    //展现类型  text\image\select\date\chart\
    t: 'text',
    //格式化
    m: 'txt',
    //字符展现形式 0-超出截断  1-溢出  2-换行
    tt: 0 | 1 | 2,
    //是否只读
    ry: number
}

declare interface CellOption{
    //默认显示文字
    value: unknown,
    //展示文本
    weitex: string,
    //公式
    formula:unknown,
    //默认格式
    type: string,
    //格式化 0-常规
    format: number,
    //字符展现形式 0-超出截断  1-溢出  2-换行
    txtFormType: 0 | 1 | 2,
    //只读
    readonly:number
}

declare interface CellStyle{
    //背景色
    bc: string,
    //字体颜色
    fc: string,
    //字体大小
    s: 12,
    //字体格式
    f:string,
    //水平方式
    a: 'left' | 'right' | 'center',
    //垂直方式
    v: 'top' | 'bottom' | 'middle',
    //粗体
    b: number,
    //斜体
    i: number,
    //下划线
    u: number,
    //边框  style color width
    bl:[string,string,number],
    br: [string,string,number],
    bt: [string,string,number],
    bb: [string,string,number],
    //斜线
    ol: [string,string,number],
    or: [string,string,number],
}

declare interface Style{
    //画布背景
    background?: string,
    //画布外边框
    outBorderColor?: string,
    //画布内边框颜色
    innerBorderColor?: string,
    //行样式
    row?:{
        //表头背景
        bgColor?: string,
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
    },
    //列样式
    col?:{
        //表头背景
        bgColor?: string,
        //字体大小
        fontSize?: number,
        //字体颜色
        fontColor?: string,
        //格式
        fontFamily: string,
        //列宽
        width?: number,
        //拖动以及设置最小宽
        minWidth?: number,
        //上侧表头高  number(px)
        height?: number,
    },
    //编辑区样式
    edit?:{
        borderColor: 'blur'
    },
    //单元格
    cell: {
        //背景
        background: string,
        //字体颜色
        color: string,
        //字体大小  px
        fontSize: number,
        //字体格式
        fontFamily: string,
        //水平方式
        textAlign: string,
        //垂直方式
        verticalAlign: string,
        //粗体
        fontWeight: number,
        //斜体
        fontStyle: number,
        //下划线
        textDecoration: number,
        
        /* 边框 */
        borderLeft:[string,string,number],
        borderRight:[string,string,number],
        borderTop: [string,string,number],
        borderBottom: [string,string,number],
        obliqueLeft: [string,string,number],
        obliqueRight: [string,string,number],
    }
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
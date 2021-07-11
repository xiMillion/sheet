
const borderColor = '#dddddd' , 
    backgroundColor = '#ffffff',
    fontColor = '#000000'
export default {
    //模式  默认 edit  只读 readonly
    mode: 'edit',
    //单元格启用富文本
    rich: false,
    //行
    row:{
        //初始行数
        length: 50,
        //具体
        map: [
            /**
             * {
             *      //高度
             *      height: 22,
             * 
             * }
             * 
            */
        ],
        //冻结行开始
        fixedStart: 0,
        //冻结行结束
        fixedEnd: 0,
        //自动延展
        extension: true,
        style:{
            //字体大小
            fontSize: 12,
            //字体颜色
            fontColor: fontColor,
            //字体格式
            fontFamily: '微软雅黑',
            //行高
            height: 22,
            //拖动以及设置最小高
            minHeight: 0,
            //左侧表头宽  auto、maxw、number(px)
            width: 'maxw',
        }
    },
    //列
    col:{
        //初始列数
        length: 26,
        //具体
        map: [
            /**
             * {
             *  //宽度
             *  height: 22,
             *  //启用筛选
             *  filter: false,
             *  //启用排序
             *  sort:false
             * }
             * 
            */
        ],
        //冻结行开始
        fixedStart: 0,
        //冻结行结束
        fixedEnd: 0,
        //自动延展
        extension: true,
        //样式
        style:{
            //字体大小
            fontSize: 12,
            //字体颜色
            fontColor: fontColor,
            //字体格式
            fontFamily: '微软雅黑',
            //列宽
            width: 80,
            //拖动以及设置最小宽
            minWidth: 0,
            //上侧表头高  number(px)
            height: 20,
        }
    },
    //单元格
    cell:{
        //默认显示文字
        value: '',
        //展示文本
        weitex: '',
        //公式
        formula:'',
        //默认格式
        type: 'text',
        //格式化 0-常规
        format: 0,
        //字符展现形式 0-超出截断  1-溢出  2-换行
        txtFormType: 0,
        //只读
        readonly:0,
        //style
        style:{
            //背景色
            bc: 'transparent',
            //字体颜色
            fc: '#000',
            //字体大小
            s: 12,
            //字体格式
            f: '微软雅黑',
            //水平方式
            a: 'center',
            //垂直方式
            v: 'middle',
            //粗体
            b: 0,
            //斜体
            i: 0,
            //下划线
            u: 0,
            //边框  style color width
            bl: ['none','#000000',1],
            br: ['none','#000000',1],
            bt: ['none','#000000',1],
            bb: ['none','#000000',1],
            //斜线
            ol: ['none','#000000',1],
            or: ['none','#000000',1],
        }
    },
    //数据
    dataSet:[
        /**
         *  
         * 
         */
    ],
    //选区
    region: {
        sr: -1,
        sc: -1,
        er: -1,
        ec: -1
    },
    //画布配置
    canvas:{
        //画布背景 'transparent'
        background: backgroundColor,
        //画布外边框颜色
        outBorderColor: borderColor,
        //画布内边框颜色
        innerBorderColor: borderColor,
        //固定行列样式
        fixedLineColor: '#0066ff',
        fixedLineWidth: 1
    },
    //样式列表
    styles:[
        {
            //背景色
            bc: 'transparent',
            //字体颜色
            fc: '#000',
            //字体大小
            s: 12,
            //字体格式
            f: '微软雅黑',
            //水平方式
            a: 'center',
            //垂直方式
            v: 'middle',
            //粗体
            b: 1,
            //斜体
            i: 1,
            //下划线
            u: 0,
            //边框  style color width
            bl: ['solid','red',1],
            br: ['dashed','yellow',1],
            bt: ['none','blue',1],
            bb: ['ddaaad','green',1],
            //斜线
            ol: ['none','#000000',1],
            or: ['none','#000000',1],
        },
        {
            //背景色
            bc: 'transparent',
            //字体颜色
            fc: '#222',
            //字体大小
            s: 20,
            //字体格式
            f: '微软雅黑',
            //水平方式
            a: 'left',
            //垂直方式
            v: 'middle',
            //粗体
            b: 0,
            //斜体
            i: 0,
            //下划线
            u: 1,
            //边框  style color width
            bl: ['solid','#f27611',1],
            br: ['dashed','#888888',1],
            bt: ['none','pink',1],
            bb: ['ddaaad','cyan',1],
            //斜线
            ol: ['none','#000000',1],
            or: ['none','#000000',1],
        }
    ],

    //条件格式
    //历史记录
    //滚动条位置
} as Option;
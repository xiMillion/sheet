
const borderColor = '#dddddd' , 
    backgroundColor = '#ffffff',
    fontColor = '#000000'
export default {
    //模式  默认 edit  只读 readonly
    mode: 'edit',
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
        extension: true
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
        extension: true
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
        readonly:0
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
    //单元格启用富文本
    rich: false,
    //画布样式
    style:{
        //画布背景 'transparent'
        background: backgroundColor,
        //画布外边框颜色
        outBorderColor: borderColor,
        //画布内边框颜色
        innerBorderColor: borderColor,
        //行样式
        row:{
            //表头背景
            bgColor: backgroundColor,
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
        },
        //列样式
        col:{
            //表头背景
            bgColor: backgroundColor,
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
        },
        //编辑区样式
        edit:{

        },
        cell: {
            //背景
            background: 'transparent',
            //字体颜色
            color: fontColor,
            //字体大小  px
            fontSize: 12,
            //字体格式
            fontFamily: '微软雅黑',
            //水平方式
            textAlign: 'center',
            //垂直方式
            verticalAlign: 'middle',
            //粗体
            fontWeight: 0,
            //斜体
            fontStyle: 0,
            //下划线
            textDecoration: 0,
            
            /* 边框 */
            borderLeft:['none','#000000',1],
            borderRight: ['none','#000000',1],
            borderTop: ['none','#000000',1],
            borderBottom: ['none','#000000',1],
            obliqueLeft: ['none','#000000',1],
            obliqueRight: ['none','#000000',1],
        },
    }
    //条件格式
    //历史记录
    //滚动条位置
};
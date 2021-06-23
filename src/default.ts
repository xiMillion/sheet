export default {
    //模式  默认 edit  只读 readonly
    mode: 'edit',
    //行
    row:{
        //初始行数
        length: 50,
        //行高
        height: 22,
        //拖动以及设置最小高
        minHeight: 0,
        //左侧表头宽  auto、maxw、number(px)
        width: 'auto',
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
        //列宽
        width: 80,
        //拖动以及设置最小宽
        minWidth: 0,
        //上侧表头高  number(px)
        height: 20,
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
        //默认样式
        style: {
            //字体大小  px
            fontSize: 12,
            //字体格式
            fontFamily: '微软雅黑',
            //字体颜色
            color: '#000000',
            //水平方式
            textAlign: 'left',
            //垂直方式
            verticalAlign: 'middle',
            //粗体
            fontWeight: false,
            //斜体
            fontStyle: false,
            //下划线
            textDecoration: false,
            //背景
            background: 'none',


            /* 边框 */

            borderLeftColor: '#000000',
            borderLeftStyle: 'none',
            borderLeftWidth: 1,

            borderRightColor: '#000000',
            borderRightStyle: 'none',
            borderRightWidth: 1,

            borderTopColor: '#000000',
            borderTopStyle: 'none',
            borderTopWidth: 1,

            borderBottomColor: '#000000',
            borderBottomStyle: 'none',
            borderBottomWidth: 1,

            obliqueLeftStyle: 'none',
            obliqueLeftColor: 'red',
            obliqueLeftWidth: 1,
            obliqueRightStyle: 'none',
            obliqueRightColor: 'blue',
            obliqueRightWidth: 1,
        },
        //字符展现形式 0-超出截断  1-溢出  2-换行
        txtFormType: 0,
        //默认显示文字
        value: '',
        //默认格式
        type: 'text',
        //单元格启用富文本
        rich: false,
        //合并单元格
        rowspan: 1,
        colspan: 1,
        //格式化 0-常规
        format: 0,
        //禁止编辑
        readonly: false
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
    //条件格式
    //历史记录
    //滚动条位置
};
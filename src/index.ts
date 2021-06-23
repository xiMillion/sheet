
import OPTION from './interface';

const log = console.log;

class XSheet {

    rootEl: HTMLElement;

    static versions = '1.00';
    static log = log;

    constructor (public dom: HTMLElement | string , public option?: OPTION){
        this.rootEl = typeof dom === 'string' ? document.querySelector(dom) : dom;

        
    }
}

// const dom = document.getElementById('btn');
// dom.onchange = function(event: any){
//     console.log(event)
//     const fileReader = new FileReader();
//     fileReader.onload = ev => {
//         const data = ev.target.result;
//         const workbook = XLSX.read(data, {
//             type: "binary"
//         });
//         console.log(workbook)
//     };

//     fileReader.readAsBinaryString(event.target.files[0]);
// }


// x_spreadsheet('#box').on('change',function(r:any){
//     log(r)
// })


export default XSheet;
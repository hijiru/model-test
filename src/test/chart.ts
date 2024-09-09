import ExcelJS from 'exceljs';
import { createCanvas } from 'canvas';
import { Chart, registerables } from 'chart.js';


export function create_line_chart(title:string,item:Array<string>,datas:Array<number>|number,backgroundColor?:Array<string>|string,borderColor?:Array<string>|string,tension?:number,fill?:string|boolean){
// 创建图表
Chart.register(...registerables);

// 创建一个新的工作簿

const width = 800;
const height = 600;
// 创建一个画布
const canvas = createCanvas(width, height);

const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
new Chart(ctx, {
  type: 'line',
  data: {
    labels: item,
    datasets: [{
      label: title,
      data: datas,
      backgroundColor:backgroundColor,
      borderColor:borderColor,
      borderWidth: 1,
      tension:tension,
      fill:fill
    }]
  },
  options: {
    scales: {
      x: {
        ticks: {
          maxRotation: 0, // 禁用旋转
          minRotation: 0, // 禁用旋转
          autoSkip: false, // 不自动跳过标籤
          font: {
            size: 24, // 设置字体大小
            family: 'Arial', // 设置字体
            weight: 'bold' // 设置字体粗细
          }
        }
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 36 // 设置图例标签的字体大小
          }
        }
      }
    }
  }
});

// 将图表保存为图像
const buffer = canvas.toBuffer('image/png');
return buffer
}

export function create_bar_chart(title:string,item:Array<string>,datas:Array<number>|number,backgroundColor?:Array<string>|string,borderColor?:Array<string>|string,tension?:number,fill?:string|boolean){
  // 创建图表
  Chart.register(...registerables);
  
  // 创建一个新的工作簿
  
  const width = 800;
  const height = 600;
  // 创建一个画布
  const canvas = createCanvas(width, height);
  
  const ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: item,
      datasets: [{
        label: title,
        data: datas,
        backgroundColor:backgroundColor,
        borderColor:borderColor,
        borderWidth: 1,
        
      }]
    },
    options: {
      scales: {
        x: {
          ticks: {
            maxRotation: 0, // 禁用旋转
            minRotation: 0, // 禁用旋转
            autoSkip: false, // 不自动跳过标籤
            font: {
              size: 24, // 设置字体大小
              family: 'Arial', // 设置字体
              weight: 'bold' // 设置字体粗细
            }
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          labels: {
            font: {
              size: 36 // 设置图例标签的字体大小
            }
          }
        }
      }
    }
  });
  
  // 将图表保存为图像
  const buffer = canvas.toBuffer('image/png');
  return buffer
  }
// 添加图像到工作表
// const imageId = workbook.addImage({
//   buffer: buffer,
//   extension: 'png'
// });

// worksheet.addImage(imageId, {
//   tl: { col: 3, row: 1 },
//   ext: { width: 500, height: 300 }  // 设置图像的宽度和高度
// });

// // 保存 Excel 文件
// workbook.xlsx.writeFile('hello.xlsx')
//   .then(() => {
//     console.log('File saved.');
//   })
//   .catch(err => {
//     console.error(err);
//   });

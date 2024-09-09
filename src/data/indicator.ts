
import  TradingView = require('@mathieuc/tradingview')
import {config as configDotenv}from 'dotenv'
import {technicalindicators,past,historical,single, price} from '../index.js'
export function tech(){
const Token =`${process.env.token}`

const client = new TradingView.Client(); // Creates a websocket client
const chart = new client.Session.Chart(); // Init a Chart session
const data_lock1:single =[]
const data_lock2:single =[]

chart.setMarket('BINANCE:BTCUSDT', { // Set the market
  timeframe: '1',
});

function getIndicData(indicator) {
  return new Promise(() => {

    const STD = new chart.Study(indicator);

    console.log(`Getting "${indicator.description}"...`);

    STD.onUpdate(() => {
    
      let data=STD.periods[0] as any
      //  console.log(`RSI:${a['RSI']}`):console.log(`MACD:${a['MACD']}`)
      if(data['RSI']!=undefined){
        technicalindicators[0]=data['RSI']
        
       
      }else if(data['MACD']!=undefined){
        technicalindicators[1]=data['MACD']
        technicalindicators[3]=data['Signal']
        technicalindicators[4]=data['Histogram']
      }else{
        technicalindicators[2]=data['MF'] 
      }
     data_lock1.length<=2?data_lock1.unshift(technicalindicators[0]):data_lock1.pop()
     data_lock2.length<=2?data_lock2.unshift(technicalindicators[1]):data_lock2.pop()
     past[0]=data_lock1[1]
     past[1]=data_lock2[1]
    //  console.log(`RSI:${technicalindicators[0]} MACD:${technicalindicators[1]} MFI:${technicalindicators[2]} past:${past[0]}`)
      // console.log(JSON.stringify(data))
      // console.log(`"${indicator.description}" done !`);
    });
  });
}
(async () => {
  console.log('Getting all indicators...');
  // const indic = await TradingView.getIndicator('STD;Money_Flow')
  // console.log(indic.inputs)
  const MACD = await addIndicator('STD;MACD',{'Fast_Length':6,'Slow_Length':13,'Signal_Smoothing':5})
  const RSI = await addIndicator('STD;RSI',{'RSI_Length':9})
  const MFI = await addIndicator('STD;Money_Flow',{'Length':9})
  // const indicData = await getIndicData(indic1)as any

  const indicData = await Promise.all([
    MACD,
    RSI,
    MFI
  ].map(getIndicData))as any

  console.log(indicData.periods);
  console.log('All done !');
})();

  async function addIndicator(Indicator, options = {}) {

    const indic = Indicator.includes('@')
    ? new TradingView.BuiltInIndicator(Indicator)
    : await TradingView.getIndicator(Indicator);
  
    Object.keys(options).forEach((o) => { indic.setOption(o, options[o]); });
  
    return indic
    
  }}
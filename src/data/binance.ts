import {WebSocket} from "ws";
import{price,technicalindicators} from "../index.js"
import{simulated_trade,average} from "../test/simulation.js"
  export async function binance_ws_(){
const ws1 = new WebSocket('wss://fstream.binance.com/stream?streams=btcusdt@aggTrade/btcusdt@markPrice');

const ws2 = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@aggTrade');



let t=20000
let timestamp=Date.now()
let times:number
  ws1.on('open', () => {
  console.log('Connected to server');

  });
  ws2.on('open', () => {
});


    
  let connect1=ws1.on('message', async(message:ArrayBufferLike ) =>{
    const start = process.hrtime.bigint();
  let now1=new Date()
  let decoder = new TextDecoder("ascii");
  let byteArray = new Uint8Array(message)
  let resp=decoder.decode(byteArray);
  if(JSON.parse(resp)['stream']=="btcusdt@aggTrade"){
    price[0] = JSON.parse(resp)['data']['p']
    price[9] = price[1]/price[0]
    price[10] = price[1]-price[0]
    times = Number(process.hrtime.bigint()-start)
    
   }else if(JSON.parse(resp)['stream']=="btcusdt@markPrice"){
        price[11] = JSON.parse(resp)['data']['p']
        price[2] = JSON.parse(resp)['data']['i']
        price[4] = (price[3]-price[2])/(price[2]-price[0])
        
  } 
  price[12] = Math.sqrt((times - average(30,times))**2)
  

    await simulated_trade()
//  console.log(`${now1.getFullYear()} ${now1.getMonth()+1} ${now1.getDate()} ${now1.getHours()}:${now1.getMinutes()}:${now1.getSeconds()}:${now1.getMilliseconds()} Binance price: ${price[0]} Bybit price: ${price[1]} i:${price[2]} macd${technicalindicators[3]} time:${price[12]}`)
                                                                  
  })

  let connect2=ws2.on('message', async(message:ArrayBufferLike ) =>{
    let now1=new Date()
    let decoder = new TextDecoder("ascii");
    
    let byteArray = new Uint8Array(message)
    let resp=decoder.decode(byteArray);
    price[3]=JSON.parse(resp)['p']
    price[4] = (price[3]-price[2])/(price[2]-price[0])
    
    // console.log(price[3],price[2],price[0],price[4])
    
      // await simulated_trade()
  //  console.log(`${now1.getFullYear()} ${now1.getMonth()+1} ${now1.getDate()} ${now1.getHours()}:${now1.getMinutes()}:${now1.getSeconds()}:${now1.getMilliseconds()} Binance price: ${price[0]} Bybit price: ${price[1]} i:${price[2]}macd${technicalindicators[3]}  time:${price[12]}`)
   
    })
  let set1=ws1.on('ping', (e) => { //Defines callback for ping event
    ws1.pong(); //send pong frame
});

let set2=ws2.on('ping', (e) => { //Defines callback for ping event
  ws2.pong(); //send pong frame
});


  
ws1.on('close', () => {
  console.log('Disconnected from server');
});

  }
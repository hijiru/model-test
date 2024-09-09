import { WebSocket } from "ws";
import { price } from "../index.js";
export async function bybit_ws_() {
    const ws2 = new WebSocket('wss://stream.bybit.com/v5/public/linear');
    let t = 20000;
    let timestamp = Date.now();
    ws2.on('open', () => {
        console.log('Connected to server');
        ws2.send(JSON.stringify({
            "req_id": "test", // optional
            "op": "subscribe",
            "args": [
                "publicTrade.BTCUSDT"
            ]
        }));
    });
    let connect2 = ws2.on('message', async (message) => {
        let now2 = new Date();
        let decoder = new TextDecoder("ascii");
        let byteArray = new Uint8Array(message);
        let resp = decoder.decode(byteArray);
        let mresp = JSON.parse((resp));
        let tresp = Object.values(Object.values(Object.values(mresp).at(3)).at(-1)).at(4);
        // console.log(`price:${JSON.stringify(tresp)},length:${tresp}`)
        price[1] = Number(tresp);
        price[9] = price[1] / price[0];
        price[10] = price[1] - price[0];
        // console.log(`${now2.getFullYear()} ${now2.getMonth()+1} ${now2.getDate()} ${now2.getHours()}:${now2.getMinutes()}:${now2.getSeconds()}:${now2.getMilliseconds()} Binance price: ${price[0]} Bybit price: ${price[1]} p:${price[9]}spread:${price[10]}`)
    });
    function ping2() {
        clearInterval(set2);
        set2 = setInterval(ping2, t);
        return ws2.send(JSON.stringify({ "req_id": "100001", "op": "ping" }));
    }
    let set2 = setInterval(ping2, t);
    ws2.on('close', () => {
        console.log('Disconnected from server');
    });
}

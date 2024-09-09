import { price } from '../index.js';
import exceljs from "exceljs";
import { create_line_chart } from './chart.js';
import { Liquidation_Price } from '../data/liquition_price.js';
let position = 0;
let times = 0;
let open_times_of_each_trading = 0;
let qty = 10;
let n = 0;
let Gain = 0;
let Loss = 0;
let Max_drawdown = 0;
let drawdown = 0;
let fl = 0;
let liquidation_price = 0;
const now = new Date();
const counter = 1;
const end_times = 20;
const binanace_wallet = 1000;
const binance_fee = 0.00018;
const leverage = 125;
const slippage = 0;
const workbook = new exceljs.Workbook();
const sheet = workbook.addWorksheet(`套利策略${now.getMonth() + 1}${now.getDate()}`);
const worksheet = workbook.getWorksheet(`套利策略${now.getMonth() + 1}${now.getDate()}`);
worksheet.addRow(["id", "餘額", "損益", "收益率", "回撤率", "執行時間"]);
const sheet1 = workbook.addWorksheet('收益表');
const worksheet1 = workbook.getWorksheet('收益表');
worksheet1.columns = [{ header: "總獲益" }, { header: "總損失" }, { header: "淨收益" }, { header: "淨收益率" }, { header: "勝率" }, { header: "平均收益率", width: 12 }, { header: "最大回撤率", width: 12 }];
export async function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
export const wallet = [binanace_wallet];
export const positions = [, , , 0];
export const data = [];
export const order = [];
export const q = [wallet[0]];
export const d = [0];
export const r = [''];
export async function simulated_trade() {
    const now1 = new Date();
    const s = price[0] - positions[0];
    const UGOL = position != 0 ? qty + ((s) * (qty / price[0])) * leverage : undefined;
    const Earn = position != 0 ? ((UGOL - qty) / qty) * 100 : 0;
    const enough = wallet[0] <= 20;
    if (UGOL != undefined) {
        Earn > positions[3] ? positions[3] = Earn : positions[3];
        console.log(`Unrealized Gain or Loss:${UGOL - qty} Earn rate:${Earn}% E:${positions[3]} price:${price[0]} liquidation_price:${liquidation_price} times:${times}`);
    }
    if (position < counter && price[0] != undefined && times != end_times && !enough && fl == 0 && price[11] != undefined) {
        // if(position<counter){
        open(counter, now1);
    }
    else if (Earn <= -1 && open_times_of_each_trading < 2) {
        console.log(`x:${Earn}`);
        open(counter, now1);
    }
    // else if(Earn<=-5&&position==counter||positions[3]-Earn>=2&&Earn>5&&position==counter){
    else if (Earn <= -5 && position == counter || Earn > 6 && position == counter) {
        close(now1, Earn);
    }
    else if (price[0] <= liquidation_price) {
        fl = 1;
        position = 0;
        positions[1] = price[0];
        positions[2] = positions[1] - positions[0];
        let close = wallet[0] + ((positions[2]) * (qty / price[0]) - (2 * qty * binance_fee) - (qty * slippage)) * leverage;
        let gol = close - wallet[0];
        if (gol > 0) {
            n += 1;
            Gain += gol;
        }
        else {
            Loss += gol;
        }
        wallet[0] = close;
        positions[3] = 0;
        q.push(wallet[0]);
        if (Earn - positions[3] < drawdown) {
            drawdown = Earn - positions[3];
        }
        worksheet.addRow([times, wallet[0], gol, Earn, positions[3] > Earn ? Earn - positions[3] : 0, `${now1.getHours()}:${now1.getMinutes()}:${now1.getSeconds()}`]);
        times += 1;
        r.push(``);
        process.nextTick(await game_over(`Forced Liquidation`));
    }
    else if (enough) {
        process.nextTick(await game_over(`Insufficient balance`));
    }
    else if (times == end_times) {
        process.nextTick(await game_over(`simulated trading is done`));
    }
    async function game_over(comment) {
        let neol = wallet[0] - binanace_wallet;
        worksheet1.addRow([Gain, Loss, neol, (neol / binanace_wallet) * 100, (n / times) * 100, ((neol / binanace_wallet) * 100) / times, Max_drawdown]);
        const imageId1 = workbook.addImage({
            buffer: create_line_chart('收益曲線(美元)', r, q, 'rgba(65,228,243,0.2)', 'rgb(30,192,240,1)', 0.2, true),
            extension: 'png'
        });
        const imageId2 = workbook.addImage({
            buffer: create_line_chart('回撤圖(%)', r, d, 'rgba(255, 99, 132, 0.2)', 'rgb(255, 99, 132)', 0, 'end'),
            extension: 'png'
        });
        worksheet.addImage(imageId1, {
            tl: { col: 7, row: 3 },
            ext: { width: 500, height: 300 }
        });
        worksheet.addImage(imageId2, {
            tl: { col: 17, row: 3 },
            ext: { width: 500, height: 300 }
        });
        process.nextTick(await workbook.xlsx.writeFile('./data.xlsx').then(() => {
            positions[1] = price[0];
            positions[2] = positions[1] - positions[0];
            console.log(comment);
            console.log(`${now1.getFullYear()} ${now1.getMonth() + 1} ${now1.getDate()} ${now1.getHours()}:${now1.getMinutes()}:${now1.getSeconds()}:${now1.getMilliseconds()} balance:${wallet[0]} Net Earn rate:${((wallet[0] - binanace_wallet) / binanace_wallet) * 100}% `);
            process.exit(0);
        })
            .catch(err => {
            console.log(err.message);
            process.exit(0);
        }));
    }
}
export function average(l, a) {
    // console.log(data)
    let x;
    if (data.length < l) {
        data.unshift(a);
        x = data.reduce((v, b) => v + b) / l;
        return x;
    }
    else {
        x = data.reduce((v, b) => v + b) / l;
        data.pop();
        // console.log(x)
        return x;
    }
}
export function open(counter, time) {
    console.log(`open`);
    position += 1;
    positions[0] = price[0];
    liquidation_price = Liquidation_Price(qty, leverage, positions[0], price[11]);
    const paramas = {
        id: `${times}x${open_times_of_each_trading}`,
        timestramp: Number(time),
        open_price: positions[0],
        symbol: "btcusdt",
        qty: (qty / price[0]).toFixed(5),
        liquidation_price: liquidation_price
    };
    open_times_of_each_trading += 1;
    order.push(JSON.stringify(paramas));
    console.log(order);
    // console.log(`${now1.getFullYear()} ${now1.getMonth()+1} ${now1.getDate()} ${now1.getHours()}:${now1.getMinutes()}:${now1.getSeconds()}:${now1.getMilliseconds()} symbol:${paramas.symbol} open price:${paramas.open_price} quantity:${paramas.qty} time:${paramas.timestramp}`)
    // console.log(`before:${positions[0]}`)
}
export function close(time, Earn) {
    position = 0;
    liquidation_price = 0;
    open_times_of_each_trading = 0;
    positions[1] = price[0];
    positions[2] = positions[1] - positions[0];
    let close = wallet[0] + ((positions[2]) * (qty / price[0]) - (2 * qty * binance_fee) - (qty * slippage)) * leverage;
    let gol = close - wallet[0];
    if (gol > 0) {
        n += 1;
        Gain += gol;
    }
    else {
        Loss += gol;
    }
    wallet[0] = close;
    positions[3] = 0;
    q.push(wallet[0]);
    times += 1;
    drawdown = q[times] - q[times - 1] < 0 ? q[times] - q[times - 1] : 0;
    Max_drawdown = Max_drawdown > drawdown ? drawdown : Max_drawdown;
    d.push(drawdown);
    worksheet.addRow([times, wallet[0], gol, Earn, drawdown, `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`]);
    r.push(``);
    console.log(`close`);
    console.log(`${time.getFullYear()} ${time.getMonth() + 1} ${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()} balance:${wallet[0]} after:${positions[1]} spread:${positions[2]} Earn rate:${Earn}% `);
    order.length = 0;
}

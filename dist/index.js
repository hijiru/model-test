import { binance_ws_ } from "./data/binance.js";
import { tech } from './data/indicator.js';
export const price = [];
export const past = [];
export const technicalindicators = [];
export const historical = [];
tech();
binance_ws_();
// // bybit_ws_()

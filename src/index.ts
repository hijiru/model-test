import {binance_ws_} from "./data/binance.js"
import {bybit_ws_} from "./data/bybit.js"
import {tech} from './data/indicator.js'

export const price:number[] = []
export type nirvana = number
export type single = Array<number>
export type double =Array<Array<number>>
export type indicator<T extends single|double> = T

export const past:indicator<single> =[]
export const technicalindicators:indicator<single> = []
export const historical:indicator<double> = []
tech()
binance_ws_()
// // bybit_ws_()


const margin_data = {
    50000: { max_leverage: 125, margin_rate: 0.004, Maintenance_Amount: 0 },
    250000: { max_leverage: 100, margin_rate: 0.005, Maintenance_Amount: 50 },
    3000000: { max_leverage: 50, margin_rate: 0.01, Maintenance_Amount: 1300 },
    15000000: { max_leverage: 20, margin_rate: 0.025, Maintenance_Amount: 46300 },
    30000000: { max_leverage: 10, margin_rate: 0.05, Maintenance_Amount: 421300 },
    80000000: { max_leverage: 5, margin_rate: 0.1, Maintenance_Amount: 1921300 },
    100000000: { max_leverage: 4, margin_rate: 0.125, Maintenance_Amount: 3130092 },
    200000000: { max_leverage: 3, margin_rate: 0.15, Maintenance_Amount: 6421300 },
    300000000: { max_leverage: 2, margin_rate: 0.25, Maintenance_Amount: 26421300 },
    500000000: { max_leverage: 1, margin_rate: 0.5, Maintenance_Amount: 101421300 },
};
export function named_value(balance, leverage, op, mp) {
    for (let i in margin_data) {
        if (balance * leverage > Number(i) && margin_data[i]['max_leverage'] == leverage || leverage > 125) {
            console.log(Error('over the max leverage'));
            process.exit(1);
        }
        else {
            return Number((balance * leverage / op).toFixed(3)) * mp;
        }
    }
}
export function margin(value, margin_rate, cum) {
    return (value * margin_rate) - cum;
}
export function Liquidation_Price_calculation({ wb, ttm1 = 0, upnl1 = 0, cumb = 0, cuml = 0, cums = 0, mmrb = 0, mmrl = 0, mmrs = 0, mp = 0, side1both = 1, position1both = 0, ep1both = 0, position1long = 0, ep1long = 0, position1short = 0, ep1short = 0 }) {
    return (wb - ttm1 + upnl1 + cumb + cuml + cums - side1both * position1both * ep1both - position1long * ep1long + position1short * ep1short) / (position1both * mmrb + position1long * mmrl + position1short * mmrs - side1both * position1both - position1long + position1short);
}
export function named_sheet(named_values) {
    for (let i in margin_data) {
        if (named_values <= Number(i)) {
            return margin_data[i];
        }
    }
}
export function Liquidation_Price(balance, leverage, open_price, mark_price) {
    let nv = named_value(balance, leverage, open_price, mark_price);
    let mmrb = named_sheet(nv)['margin_rate'];
    let cumb = named_sheet(nv)['Maintenance_Amount'];
    let paramas = {
        wb: balance,
        cumb: cumb,
        mmrb: mmrb,
        side1both: 1,
        position1both: Number((balance * leverage / open_price).toFixed(3)),
        ep1both: open_price,
    };
    return Liquidation_Price_calculation(paramas);
}

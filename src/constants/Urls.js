export const poolDailyPriceUrl = "https://api-osmosis.imperator.co/pools/v2/all?low_liquidity=false"

export const tokenPricesUrl = "https://api-osmosis.imperator.co/tokens/v2/all"

export const totPoolsUrl = "https://lcd-osmosis.blockapsis.com/osmosis/gamm/v1beta1/num_pools"

export function eachPoolPriceUrl(poolId){
    return `https://api-osmosis.imperator.co/pools/v2/${poolId}`
}
export function tokenChart(token){
    return `https://api-osmosis.imperator.co/tokens/v1/historical/${token}/chart?range=30d`
}

export function poolParamsUrl(totPools){ 
    return `https://lcd-osmosis.blockapsis.com/osmosis/gamm/v1beta1/pools?pagination.offset=0&pagination.limit=${totPools}`
}

export function eachPoolParamsUrl(poolId){
    return `https://lcd-osmosis.blockapsis.com/osmosis/gamm/v1beta1/pools/${poolId}`
}




const corsUrl = "https://rocky-ocean-85592.herokuapp.com/"
const poolDataApi = "https://lcd-osmosis.blockapsis.com"

const priceDataApi ="https://api-osmosis.imperator.co"
export const poolDailyPriceUrl = priceDataApi+"/pools/v2/all?low_liquidity=false"

export const tokenPricesUrl = priceDataApi+"/tokens/v2/all"

export const totPoolsUrl = corsUrl+poolDataApi+"/osmosis/gamm/v1beta1/num_pools"

export function eachPoolPriceUrl(poolId){
    return `${priceDataApi}/pools/v2/${poolId}`
}
export function tokenChart(token){
    return `${priceDataApi}/tokens/v2/historical/${token}/chart?tf=1440`
}

export function poolParamsUrl(totPools){ 
    return `${corsUrl}${poolDataApi}/osmosis/gamm/v1beta1/pools?pagination.offset=0&pagination.limit=${totPools}`
}

export function eachPoolParamsUrl(poolId){
    return `${corsUrl}${poolDataApi}/osmosis/gamm/v1beta1/pools/${poolId}`
}




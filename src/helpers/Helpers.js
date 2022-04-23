import bigInt from "big-integer"
export function handleResponse(res, errorMessage){
    if(res.ok){
        return res.json()
    }else{
        throw new Error(errorMessage)
    }
}

export function calculateWeights(weights){
    const totWeight = weights.reduce((sum, item)=> sum = bigInt(sum)+bigInt(item), bigInt())
    const decimalWeights = weights.map(weight => bigInt(weight*100)/bigInt(totWeight)/100)
    return decimalWeights
}

export function calculatePoolValue(periodReturns, decimalWeights){
    return (periodReturns
    .map((tokenReturn, index) => Math.pow(tokenReturn,decimalWeights[index]))
    .reduce((prod, item)=> prod = prod*item,1))
}

export function calculateHoldValue(periodReturns, decimalWeights){
    return (periodReturns
    .map((tokenReturn, index) => tokenReturn*decimalWeights[index])
    .reduce((sum, item)=> sum = sum+item,0))
}

export function getCurrencyPriceArray(token, poolPriceData){
    const nValues = poolPriceData.get(token).length
    const priceData = poolPriceData.get(token)
    const pastPrices = []
    if(nValues>31){
        pastPrices.push([priceData[nValues-2],
                            priceData[nValues-8],
                            priceData[nValues-31]])
    }
    return pastPrices
}
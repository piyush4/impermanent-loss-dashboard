import React from "react"
import '../../App.css'
import {greenCol, redCol, upArrow, downArrow} from '../../constants/Constants.js'
import {Link} from 'react-router-dom'
import { calculateHoldValue, calculatePoolValue, calculateWeights } from "../../helpers/Helpers"

function Pool(props){
    const {poolId, poolData, coinData, poolWeights,searchState} = props
    const currencies_price_change= []
    const currencies_price = []
    const weights = []
    let volume_24h_change = 0.0
    let liquidity_24h_change = 0.0
    let vol_color = greenCol
    let liquidity_color = greenCol

    let impermanentLoss1D = 0
    let newPoolValue = 0
    let newHoldValue = 0
    
    // check whether all the tokens in the pool have their names in the API
    let allNamesPresent = poolData.reduce((present, item)=> item.symbol!=="" && present, true)

    // construct Pool name
    const poolName = poolData.reduce((poolName, item)=> poolName+item.symbol+"/","").slice(0,-1)
    const presentInSearchState = poolName.toUpperCase().includes(searchState)
    allNamesPresent = allNamesPresent && presentInSearchState

    // filter out the pools that don't have the coin symbols in the API results
    const coinsInPool = poolData
            .filter(coinDetails=>coinDetails.symbol!=='')
            .map(coinDetails =>coinDetails.symbol)
    
    
    if(coinData!==undefined && poolWeights!==undefined){
        currencies_price_change.push(...(coinsInPool
            .map(coin => coinData.get(coin).deltaPrice)))
        
        currencies_price.push(...(coinsInPool
            .map(coin => coinData.get(coin).price)))
        
        weights.push(...(coinsInPool
            .map(coin => {
                const denom = coinData.get(coin).denom
                const weight = poolWeights
                .filter(tokenInfo =>tokenInfo.token.denom===denom)
                .map(tokenInfo => tokenInfo.weight)
                return weight[0]
        })))
        volume_24h_change = parseFloat(poolData[0].volume_24h_change)
        liquidity_24h_change = parseFloat(poolData[0].liquidity_24h_change)
        vol_color = volume_24h_change>0?greenCol:redCol
        liquidity_color = liquidity_24h_change>0?greenCol:redCol
    }
    
    if(weights!==[]){
        const decimalWeights = calculateWeights(weights)
        newPoolValue = calculatePoolValue(currencies_price_change.map(price_change => price_change/100+1),decimalWeights)
        newHoldValue = calculateHoldValue(currencies_price_change.map(price_change=> price_change/100+1), decimalWeights) 
        impermanentLoss1D = newPoolValue/newHoldValue -1
    }
    
    return(
        allNamesPresent &&
        <React.Fragment>
        
        <tr className="poolsTableCards">
            <td><Link key={poolId} to={poolId}>{poolId}</Link></td>
            <td><Link key={poolId} to={poolId}>{poolName}</Link></td>
            <td style={{color:vol_color}}>{`${String.fromCharCode(volume_24h_change>0?upArrow:downArrow)} ${volume_24h_change.toFixed(2)}`}%</td>
            <td style={{color:liquidity_color}}>{`${String.fromCharCode(liquidity_24h_change>0?upArrow:downArrow)} ${liquidity_24h_change.toFixed(2)}`}%</td>
            <td>{(impermanentLoss1D*100).toFixed(3)}%</td>   
        </tr>
        
        
        </React.Fragment>)
}
export default Pool
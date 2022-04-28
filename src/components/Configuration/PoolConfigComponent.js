import React, { useState, useEffect } from 'react'
import { eachPoolPriceUrl, tokenChart } from '../../constants/Urls'
import { calcAmount, calculateWeights, 
    calculateHoldValue, calculatePoolValue, 
    getCurrencyPriceArray, handleResponse } from '../../helpers/Helpers'
import ImpermanentLossCard from './ImpermanentLossCard'
import Loading from '../Loading'

function PoolConfigComponent(props){
    const {poolName, poolWeights} = props
    const indexDash = poolName.indexOf('-')
    const poolId = poolName.substring(0, indexDash)
    console.log(poolWeights)
    const [poolTokens, setPoolTokens] = useState([])
    const [poolPriceData, setPoolPriceData] = useState(new Map())
    const [denomData, setDenomData] = useState(new Map())
    const weights = new Map()
    const [amountInvested, setAmountInvested] = useState(10000)
    const [currentPeriod, setCurrentPeriod] = useState("1D")
    const [currentPrices, setCurrentPrices] = useState([])
    const [showOptions, setShowOptions] = useState('hidden')
    const periodMap = {"1D":0, "7D":1, "1M":2, "3M":3, "6M":4, "Max":5}
    let impermLoss = {"1D":0,"7D":0,"1M":0, "3M":0, "6M":0, "Max":0}
    let decimalWeights = []
    let pastTokensPrices = []
    const newHoldValue = []
    const newPoolValue = []

    poolWeights.get(poolId).map(token => {
                    weights.set(token.token.denom, token.weight)
                    return token.weight})
    // Event handlers
    function handleInput(e){
        e.preventDefault()
        setAmountInvested(e.target.value)   
    }
    function handleSubmit(e){
        e.preventDefault()
    }
    function handlePeriodSelect(event){
        showOptions==='hidden'?setShowOptions('not-hidden'):setShowOptions('hidden')
    }
    function handleClick(event){
        setCurrentPeriod(event.target.textContent)
        showOptions==='hidden'?setShowOptions('not-hidden'):setShowOptions('hidden')
    }
    //load the data required for the page render
    useEffect(()=>{
        fetch(eachPoolPriceUrl(poolId))
            .then(res=>handleResponse(res))
            .then(data=> {  
                data.map(token => {
                setPoolTokens(prevPoolTokens =>[...prevPoolTokens, token.symbol]) 
                setCurrentPrices(prevCurrentPrices =>[...prevCurrentPrices, token.price])
                setDenomData(new Map(denomData.set(token.symbol, token.denom)))
        })})
    },[])  
    useEffect(()=>{
        if(poolTokens.length>1){
            poolTokens.map(token=> fetch(tokenChart(token))
            .then(res=>handleResponse(res))
            .then(data=>{
                if(data.length<2){
                    throw new Error("Not enough data")
                }
                return setPoolPriceData(new Map(poolPriceData.set(token, 
                (data.map(tokenPriceInfo =>tokenPriceInfo.close))
                )))
            }).catch(error => console.log(error)))
        }
    },[poolTokens])
    
    // If the data is available calculate impermanent loss
    if(weights.size>1 && poolPriceData.size===poolTokens.length){
        decimalWeights = (calculateWeights(poolTokens.map(token => weights.get(denomData.get(token)))))
        pastTokensPrices = (poolTokens
                           .map(token => getCurrencyPriceArray(token, poolPriceData)))
        if(pastTokensPrices.length>1){
            const returns = []
            for(let i=0;i<pastTokensPrices[0][0].length;i++){
                returns.push(pastTokensPrices.map((token,index) => currentPrices[index]/token[0][i]))
            }
            
            for(let i=0;i<returns.length;i++){
                newPoolValue.push(calculatePoolValue(returns[i], decimalWeights))
                newHoldValue.push(calculateHoldValue(returns[i], decimalWeights))
            }
            let newImpermLoss = {}
            for(let i=0;i<Object.keys(impermLoss).length;i++){
                newImpermLoss[Object.keys(impermLoss)[i]] = (newPoolValue[i].toFixed(5)-newHoldValue[i].toFixed(5))
            }
            impermLoss = newImpermLoss
        } 
    }
    //JSX
    if(poolTokens.length>1){
        return(
            <ImpermanentLossCard
                    poolTokens = {poolTokens}
                    currentPeriod = {currentPeriod}
                    amountInvested ={amountInvested}
                    impermLoss = {impermLoss}
                    handleInput = {handleInput}
                    handleSubmit = {handleSubmit}
                    handleClick = {handleClick}
                    handlePeriodSelect = {handlePeriodSelect}
                    poolValue = {newPoolValue}
                    holdValue = {newHoldValue}
                    periodMap = {periodMap}
                    pastTokensPrices = {pastTokensPrices}
                    showOptions = {showOptions}
            />
        )
    }else{
        return(<Loading/>)
    }
    
}

export default PoolConfigComponent
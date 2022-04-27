import React from "react"
import { useEffect, useState } from "react"
import { eachPoolPriceUrl, eachPoolParamsUrl, tokenChart } from "../constants/Urls"
import { headers } from "../constants/Constants"
import {useParams} from 'react-router-dom'
import { calculateHoldValue, calculatePoolValue, calculateWeights, getCurrencyPriceArray, handleResponse } from "../helpers/Helpers"
import ImpermanentLossCard from "./ImpermanentLossCard"
import Loading from "./Loading"

function PoolDetail(){
    const {poolId}= useParams()
    const [poolTokens, setPoolTokens] = useState([])
    const [poolPriceData, setPoolPriceData] = useState(new Map())
    const [denomData, setDenomData] = useState(new Map())
    const [weights, setWeights] = useState(new Map())
    const [amountInvested, setAmountInvested] = useState(10000)
    const [currentPeriod, setCurrentPeriod] = useState("1D")
    const [currentPrices, setCurrentPrices] = useState([])

    const periodMap = {"1D":0, "7D":1, "1M":2, "3M":3, "6M":4, "Max":5}
    let impermLoss = {"1D":0,"7D":0,"1M":0, "3M":0, "6M":0, "Max":0}
    let decimalWeights = []
    let pastTokensPrices = []
    const newHoldValue = []
    const newPoolValue = []
    // Event handlers
    function handleInput(e){
        e.preventDefault()
        console.log(e.target.value)
        setAmountInvested(e.target.value)   
    }
    function handleSubmit(e){
        e.preventDefault()
    }
    function handleClick(event){
        setCurrentPeriod(event.target.textContent)
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
        fetch(eachPoolParamsUrl(poolId),headers)
            .then(res=>handleResponse(res))
            .then(data=>{
                data.pool.poolAssets.map(token => {
                    setWeights(new Map(weights.set(token.token.denom, token.weight)))
                    return token.weight
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
    if([...weights.keys()].length>1 && poolPriceData.size===poolTokens.length){
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
                    poolValue = {newPoolValue}
                    holdValue = {newHoldValue}
                    periodMap = {periodMap}
                    pastTokensPrices = {pastTokensPrices}
            />
        )
    }else{
        return(<Loading/>)
    }
    
}

export default PoolDetail
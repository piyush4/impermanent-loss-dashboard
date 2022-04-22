import React from "react"
import { useEffect, useState } from "react"
import { eachPoolPriceUrl, eachPoolParamsUrl, tokenChart } from "../constants/Urls"
import { headers } from "../constants/Constants"
import {useParams} from 'react-router-dom'
import { calculateHoldValue, calculatePoolValue, calculateWeights, getCurrencyPriceArray, handleResponse } from "../helpers/Helpers"

function PoolDetail(){
    const {poolId}= useParams()
    const [poolTokens, setPoolTokens] = useState([])
    const [poolPriceData, setPoolPriceData] = useState(new Map())
    const [weights, setWeights] = useState([])
    const [amountInvested, setAmountInvested] = useState(100)
    const [currentPeriod, setCurrentPeriod] = useState("1D")
    const [currentPrices, setCurrentPrices] = useState([])
    const periodMap = {"1D":0, "7D":1, "30D":2}
    let impermLoss = {"1D":0,"7D":0,"30D":0}
    // handle events
    function handleInput(e){
        e.preventDefault()
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
        })})

        fetch(eachPoolParamsUrl(poolId),headers)
            .then(res=>handleResponse(res))
            .then(data=>
                data.pool.poolAssets.map(token => {
                    setWeights(prevWeights=>[...prevWeights,token.weight])
                    return  token.weight
        }))
    },[])  
    useEffect(()=>{
        if(poolTokens.length>1){
            poolTokens.map(token=> fetch(tokenChart(token))
            .then(res=>handleResponse(res))
            .then(data=> setPoolPriceData(new Map(poolPriceData.set(token, 
                (data.map(tokenPriceInfo =>tokenPriceInfo.close))
            )))).catch(error => console.log(error))
            )
        }
    },[poolTokens])
    // If the data is available calculate impermanent loss
    if(weights.length>1 && poolPriceData.size==poolTokens.length){
        const decimalWeights = calculateWeights(weights)
        const pastTokensPrices = poolTokens.map(token => getCurrencyPriceArray(token, poolPriceData))
        if(pastTokensPrices.length>1){
            const returns = []
            
            for(let i=0;i<pastTokensPrices[0][0].length;i++){
                returns.push(pastTokensPrices.map((token,index) => currentPrices[index]/token[0][i]))
            }
            const newHoldValue = []
            const newPoolValue = []
            
            for(let i=0;i<returns.length;i++){
                newPoolValue.push(calculatePoolValue(returns[i], decimalWeights))
                newHoldValue.push(calculateHoldValue(returns[i], decimalWeights))
            }
            
            let newImpermLoss = {}
            for(let i=0;i<3;i++){
                newImpermLoss[Object.keys(impermLoss)[i]] = (newPoolValue[i].toFixed(5)-newHoldValue[i].toFixed(5))
            }
            impermLoss = newImpermLoss
        } 
    }
    //JSX
    return(
    <div className="il-card"> 
        <h3>Impermanent Loss for {poolTokens.reduce((pool, token)=>pool+token+"-","").slice(0,-1)}</h3>
        <form>
            <label htmlFor="amount">LP Amount (USD)</label>
            <input 
            id="amount" 
            className="amount" 
            type="text" 
            value={amountInvested}
            onChange = {handleInput}
            onSubmit = {handleSubmit}
            autoComplete="off"></input>
        </form>
        <div className="periods">
            <p href="" onClick={handleClick} id={`${currentPeriod===`1D`?'isActive':''}`}>1D</p>
            <p onClick={handleClick} id={`${currentPeriod===`7D`?'isActive':''}`}>7D</p>
            <p onClick={handleClick} id={`${currentPeriod===`30D`?'isActive':''}`}>30D</p>
        </div>
        <div className="impermanent-loss">            
            <p>Pool Impermanent Loss: ${(impermLoss[currentPeriod]*amountInvested*(-1)).toFixed(1)}</p>
        </div>
    </div>)
}

export default PoolDetail
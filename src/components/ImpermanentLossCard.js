import React from "react"
import { calcAmount } from "../helpers/Helpers"
function ImpermanentLossCard(props){
    const {poolTokens, currentPeriod, amountInvested, impermLoss, poolValue, holdValue, periodMap} =props
    const {handleInput, handleSubmit, handleClick} = props
    const periodParas = Object.keys(impermLoss).map(period => {
        return (
        <p key={period}
            onClick={handleClick}
            id={currentPeriod === period?'isActive':''}>
            {period}
        </p>)
    })
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
            {periodParas}
        </div>
        <div className="resultsContainer">
            <table>
                <tbody>
                    <tr>
                        <td className="resultCategory">Pool Value:</td>
                        <td className="result">${calcAmount(poolValue[periodMap[currentPeriod]], amountInvested)}</td>
                    </tr>
                    <tr>
                        <td className="resultCategory">Hold Value:</td>
                        <td className="result">${calcAmount(holdValue[periodMap[currentPeriod]], amountInvested)}</td>
                    </tr>
                    <tr>
                        <td className="resultCategory">Impermanent Loss:</td>
                        <td className="result">${calcAmount(impermLoss[currentPeriod],amountInvested)*-1}</td>
                    </tr>
                </tbody>
            </table>           
        </div>
    </div>
    )
}
export default ImpermanentLossCard
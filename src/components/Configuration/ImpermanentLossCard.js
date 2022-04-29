import React from "react"
import { calcAmount, hiddenTransitionStyle } from "../../helpers/Helpers"

function ImpermanentLossCard(props){
    const {poolTokens, currentPeriod, amountInvested,
         impermLoss, poolValue, holdValue, 
         periodMap, showOptions} =props
    const {handleInput, handleSubmit, handleClick, handlePeriodSelect} = props
    const periodParas = Object.keys(impermLoss).map(period => {
        return (
        <li key={period}
            onClick={handleClick}
            className="options"
            value={period}>
            {period}
        </li>)
    })
    return(
        <div className="il-card-configuration"> 
        <h3>{poolTokens.reduce((pool, token)=>pool+token+"/","").slice(0,-1)}</h3>
        <form className="config-form">
            <label htmlFor="amount">LP Amount (USD)</label>
            <input 
            id="amount" 
            className="amount-config" 
            type="text" 
            value={amountInvested}
            onChange = {handleInput}
            onSubmit = {handleSubmit}
            autoComplete="off"></input>
        </form>
        <div className="custom-dropdown">
            <p  className="selectedPeriod" 
                onClick={handlePeriodSelect}>{currentPeriod}</p>
            <ul name="period"
                    className={`periodSelector`}
                    style= {hiddenTransitionStyle(showOptions)}>
                    {periodParas}
            </ul>
        </div>
        <table className="resultsContainer">
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
    )
}
export default ImpermanentLossCard
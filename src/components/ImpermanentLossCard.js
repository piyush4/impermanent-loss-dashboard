import React from "react"

function ImpermanentLossCard(props){
    const {poolTokens, currentPeriod, amountInvested, impermLoss} =props
    const {handleInput, handleSubmit, handleClick} = props
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
            onChange = {(e)=>handleInput(e)}
            onSubmit = {(e)=>handleSubmit(e)}
            autoComplete="off"></input>
        </form>
        <div className="periods">
            <p href="" onClick={(e)=>handleClick(e)} id={`${currentPeriod===`1D`?'isActive':''}`}>1D</p>
            <p onClick={handleClick} id={`${currentPeriod===`7D`?'isActive':''}`}>7D</p>
            <p onClick={handleClick} id={`${currentPeriod===`30D`?'isActive':''}`}>30D</p>
        </div>
        <div className="resultsContainer">            
            <p className="resultCategory">Pool Impermanent Loss: <span className="result">${(impermLoss[currentPeriod]*amountInvested*(-1)).toFixed(2)}</span></p>
        </div>
    </div>
    )
}
export default ImpermanentLossCard
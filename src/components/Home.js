import React from "react"
import Pool from "./Pool"
import {useState} from 'react'
import Loading from "./Loading"
function Home(props){
  
    const {data, coinData, poolWeights} = props
    const dataKeys = Object.keys(data)
    const [searchState, setSearchState] = useState('')

    const poolItems = dataKeys.map(key => {
    return(<Pool key = {key} 
                 poolId = {key}
                 poolData = {data[key]}
                 coinData = {coinData}
                 poolWeights = {poolWeights.get(key)}
             />
            )
  })
    return (
    <React.Fragment>
      <div className="tableContainer" style={{overflowX:"auto"}}>
        <table className="poolsTable">
          <tbody>
            <tr>
              <th>Pool Id</th>
              <th>Pool Name</th>
              <th>Volume 24h</th>
              <th>Liquidity 24h</th>
              <th>IL 24h</th>
            </tr>
            {poolItems.length>0? poolItems:<Loading/>}
          </tbody>
        </table>
      </div>
      <p className="TableDescription">
          IL 24h= Impermanent Loss in Pool in the  last 24 hours <br/>
      </p>
    </React.Fragment>)
}
export default Home
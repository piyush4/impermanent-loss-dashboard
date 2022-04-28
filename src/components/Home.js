import React from "react"
import Pool from "./Home/Pool"
import {useState} from 'react'
import Loading from "./Loading"
import SearchMenuBar from "./Home/SearchMenuBar"
function Home(props){
  
    const {data, coinData, poolWeights} = props
    const dataKeys = Object.keys(data)
    const [searchState, setSearchState] = useState('')

    function handleChange(event){
      setSearchState(event.target.value)
    }
    let poolItems = []
    if(poolWeights.size>0){
      poolItems = dataKeys.map(key => {
        return(<Pool key = {key} 
                    poolId = {key}
                    poolData = {data[key]}
                    coinData = {coinData}
                    poolWeights = {poolWeights.get(key)}
                    searchState = {searchState.toUpperCase()}
                />
              )
        })
    } 
    
    return (
    <div className="home">
      <SearchMenuBar 
                    handleClassName={'from_overview'}
                    searchState={searchState}
                    handleChange ={handleChange}/>
      
        <div className="tableContainer">
          {poolItems.length==0?<Loading/>:(<table className="poolsTable">
          
            <thead>
              <tr>
                <th>#</th>
                <th>Pool Name</th>
                <th>Volume 24h</th>
                <th>Liquidity 24h</th>
                <th>IL 24h</th>
              </tr>
            </thead>
            <tbody>
              {poolItems}
            </tbody>
          </table>)}
        </div>
      <p className="TableDescription">
          IL 24h= Impermanent Loss in Pool in the  last 24 hours <br/>
      </p>
    </div>)
}
export default Home
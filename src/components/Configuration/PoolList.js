import React from "react"
import {useState} from 'react'
import { hiddenTransitionStyle } from "../../helpers/Helpers"
import SearchMenuBar from "../Home/SearchMenuBar"

function PoolList(props){
    const {data, hideList, handleCloseList, handlePoolAddition} = props
    const [searchState, setSearchState] = useState('')

    function handleChange(e){
        setSearchState((e.target.value))
    }
    const listOfPools = Object.keys(data)
    .map(key=> `${key}- ${data[key]
        .reduce((poolName, tokenInfo)=>tokenInfo.symbol+"/"+poolName,'')
        .slice(0,-1)}`)
    
    const listItems = listOfPools
    .filter(pool=>pool.toUpperCase().includes(searchState.toUpperCase()))
    .map(pool => <p onClick = {handlePoolAddition}
                    className = 'selectablePools'
                    key={pool}>{pool}</p>)
    return(
        <div className={`selectablePoolList`}
             style={hiddenTransitionStyle(hideList)}>
            <div className='sticky-part'> 
                <div className="headingList">
                    <h3 className="list-of-pool">List of Pool</h3>
                    <div className='closeButton' onClick={handleCloseList}><p>&#x2715;</p></div>
                </div>
                <SearchMenuBar 
                handleClassName={'from_configuration'}
                handleChange = {handleChange} 
                searchState ={searchState}/>
            </div>
            {listItems}
        </div>
    )
}
export default PoolList
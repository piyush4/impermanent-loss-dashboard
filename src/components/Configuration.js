import React from 'react'
import {useState, useEffect} from 'react'
import {poolDailyPriceUrl, totPoolsUrl, poolParamsUrl, tokenPricesUrl} from '../constants/Urls.js'
import { handleResponse } from '../helpers/Helpers'
import {headers} from '../constants/Constants.js'
import PoolList from './Configuration/PoolList'
import PoolConfigComponent from './Configuration/PoolConfigComponent.js'
import Loading from './Loading.js'

function Configuration(){
    const [data, setdata] = useState([])
    const [totalPools, setTotalPools] = useState(0)
    const [poolWeights, setPoolWeights] = useState(new Map())
    const [userPools, setUserPools] = useState([])
    const [hideList, setHideList] = useState('hidden')

    const [poolConfigComponents,setPoolConfigComponents] = useState([])
    function handleAddPoolClick(e){
        setHideList('not-hidden')
    }
    function handleCloseList(){
        setHideList('hidden')
    }
    function handlePoolAddition(e){
        setHideList('hidden')
        setUserPools(prevUserPools =>[...prevUserPools, e.target.textContent])
    }
    
    useEffect(()=>{
        // Get list of available pools
        fetch(poolDailyPriceUrl)
        .then(res => handleResponse(res, "Cannot get daily prices"))
        .then(data =>{
        setdata(data)
        }).catch(error=>console.log(error))
           //Get total number of pools
        fetch(totPoolsUrl,headers)
        .then(res => handleResponse(res, "Cannot get number of pools"))
        .then(data => setTotalPools(data.numPools)).catch(error=>console.log(error))        
    },[])
    
    useEffect(()=>{
        if(totalPools!==0){
        fetch(poolParamsUrl(totalPools), headers)
        .then(res=>handleResponse(res))
        .then(data =>{
            setPoolWeights(new Map((data.pools.map(pool=> {
            return ([pool.id, pool.poolAssets])
            }))))
        }).catch(error=>console.log(error))
        }  
    },[totalPools])
    
    useEffect(()=>{
        if(userPools.length>0){
        setPoolConfigComponents(prevPoolConfigs=>[...prevPoolConfigs, 
                                  <PoolConfigComponent key={userPools[userPools.length-1]}
                                                    poolWeights={poolWeights}
                                                    poolName = {userPools[userPools.length-1]} />])
        }
    },[userPools])
    console.log(poolConfigComponents)
    return(
        poolWeights.size>0?(
        <div className="configuration">
            <button onClick={handleAddPoolClick}
                    className='addPool'>
                Add a pool
            </button>
            <PoolList hideList = {hideList} 
                    data={data}
                    handleCloseList={handleCloseList}
                    handlePoolAddition = {handlePoolAddition}/>
            {userPools.length>0 &&
            <div className="selectedConfigurations">
                {poolConfigComponents}  
            </div>}
            
        </div>):(<Loading/>)
        
    )
}
export default Configuration
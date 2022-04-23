import Header from './components/Header'
import Home from './components/Home'
import PoolDetail from './components/PoolDetail';
import Footer from './components/Footer';
import Configuration from './components/Configuration';
import { poolDailyPriceUrl, totPoolsUrl, poolParamsUrl, tokenPricesUrl } from './constants/Urls';
import './App.css';
import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { handleResponse } from './helpers/Helpers';
import { headers } from './constants/Constants';
function App() {
  const [data, setdata] = React.useState([])
  const [coinData, setCoinData] = React.useState(new Map())
  const [poolWeights, setPoolWeights] = React.useState(new Map())
  const [totalPools, setTotalPools] = React.useState(0)
  
  React.useEffect(()=>{
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
    // Get coin prices over the last 24 hours
    fetch(tokenPricesUrl)
      .then(res=>handleResponse(res, "Cannot get token prices"))
      .then(data => {
          data.map(coin => {
            setCoinData(new Map(coinData.set(coin.symbol, {
              name:coin.name,
              price:coin.price,
              deltaPrice:coin.price_24h_change,
              denom:coin.denom
            })))
          })
        }).catch(error=>console.log(error))
  },[])
  
  //Get Pool weights
  React.useEffect(()=>{
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

  return (
    <React.Fragment>
      <Header/>
      <Routes>
        <Route exact path="/" 
        element={<Home data={data} 
        coinData = {coinData} 
        poolWeights = {poolWeights}/>}/>
        <Route path="/:poolId" 
        element={<PoolDetail/>}/>
        <Route path="/configuration"
        element={<Configuration/>}/>
      </Routes>
      <Footer/>
    </React.Fragment>
  );
}
//<Route path= "/:countryId" element={<CountryDetail/>}></Route>
export default App;

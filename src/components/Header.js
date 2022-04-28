import React from "react"
import {useState, useEffect} from 'react'
import {Link, useLocation } from "react-router-dom"

function Header(){
    let {pathname} = useLocation()
    const [isActive, setIsActive] = useState()
    useEffect(()=>{
        setIsActive(pathname)
    },[pathname])
    
    return(
    <div className="header">
        <h1>
        <Link to='/'>Osmosis Dashboard</Link>
        </h1>
        <ul className="menu">
            <Link to='/'><li className={`${isActive==='/'?'isActive':''}`}>Overview</li></Link>
            <Link to='configuration'><li className={`${isActive==='/configuration'?'isActive':''}`}>Custom Dashboard</li></Link>
        </ul>
    </div>)
}

export default Header
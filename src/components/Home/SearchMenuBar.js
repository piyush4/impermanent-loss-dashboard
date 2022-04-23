import React from "react"

function SearchMenuBar(props){
    const {handleChange, searchState} = props
    return(<div>
        <form className="searchContainer">
        <input className="searchHome"
               placeholder="Enter pool name to search"
               onChange = {(e)=>handleChange(e)}
               value={searchState}/>
        </form>
      </div>)
}

export default SearchMenuBar
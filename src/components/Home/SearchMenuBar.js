import React from "react"

function SearchMenuBar(props){
    const {handleClassName, handleChange, searchState} = props
    return(
      <div>
        <form className='searchContainer'>
        <input className={handleClassName}
               placeholder="Enter pool name to search"
               onChange = {(e)=>handleChange(e)}
               value={searchState}/>
        </form>
      </div>)
}

export default SearchMenuBar
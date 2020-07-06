import React, { useState } from "react";
import { LoadArea } from "./data";
// Search input
export default function SearchArea({update}) {
    // Input state
    const [state, setState] = useState("");
    // Filtered area names state
    const [data, setNewData] = useState([]);
    // Filter data: [name, idx] - temp storing of the names
    let areaTemp = [];
        data.forEach((a)=>{areaTemp.push(a[1]);})
    // Event - input change: update state
    function handleOnChange(event) {
        setState( event.target.value );
    }
    // Event - key up: pass the filtered names to App.js
    function handleOnKey(event) {
        // If hit delete, clear the names
        if(event.which === 8 || event.keycode === 46){
            update([]);
        }else{
            update(areaTemp);
        }
    }

    return (
        <div className="range">
            <input className="search" type="text" placeholder="Search area" onChange={handleOnChange} onKeyUp={handleOnKey}></input>
            {state && <LoadArea values={state} input={value => setNewData(value)} />}
        </div>
    );

}
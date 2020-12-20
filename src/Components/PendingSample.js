import React from 'react';
import "./myStyle.css";
import {useSelector,useDispatch} from 'react-redux'

const PendingSample = () => {
    const data = useSelector(state=>state.hello)
    console.log(data)
    if(!data){
        return <div>Loading</div>
    }
    return (
        <div className="p1">
            <p>{data}</p>
            <p >This is pending sample page</p>
            <div>MOherdlfsl;</div>
        </div>
    )
}

export default PendingSample;
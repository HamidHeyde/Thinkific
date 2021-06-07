import React, {useState,useContext, useEffect} from 'react';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';

const Dashboard = function(){
    
    let {setLoggedin,setToken,token} = useContext(AuthContext);

    const [formMessage,setFormMessage]=useState({
        type:'noMessage',
        message:'Try One of the Buttons Below'
    })
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [counter, setCounter] = useState('300');

    useEffect(() => {
        setLoading(true);
        
        var storageToken = window.localStorage.getItem('token');
        if(storageToken){
            var token = JSON.parse(storageToken);

            // eslint-disable-next-line react-hooks/exhaustive-deps
            setLoggedin(true);
            setToken(token);
        }

        setLoading(false);

    },[])

    const handleCounterChange = function(e){
        setCounter(e.target.value);
    }
    const handleCurrentCounter = function(){
        if (!requesting){
            setRequesting (true);
            var base = (process.env.NODE_ENV==='development')
            ? process.env.REACT_APP_API_URL
            : window.location.origin

            axios({
                method: "get",
                url: base+"/v1/current",
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            })
            .then(function(res){
                
                setFormMessage({
                    type:"success",
                    message: `Current Counter Value is => ${res.data.message}`
                })
                setRequesting (false);

            }).catch(function(err){
                setRequesting (false);
                if (typeof(err.response)=="undefined"){
                    setFormMessage({
                        type:"error",
                        message:`Request timeout!`
                    })
                }else{
                    setFormMessage({
                        type:"error",
                        message: err.response.data.message
                    })
                }
            });

        }else{
            setFormMessage({
                type:"error",
                message: 'Another Request in Progress! wait for that one to finish!'
            })
        }
        
    }
    const handleNextCounter = function(){
        if (!requesting){
            setRequesting (true);
            var base = (process.env.NODE_ENV==='development')
            ? process.env.REACT_APP_API_URL
            : window.location.origin

            axios({
                method: "get",
                url: base+"/v1/next",
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            })
            .then(function(res){
                
                setFormMessage({
                    type:"success",
                    message: `Next Counter Value is => ${res.data.message}`
                })
                setRequesting (false);

            }).catch(function(err){
                setRequesting (false);
                if (typeof(err.response)=="undefined"){
                    setFormMessage({
                        type:"error",
                        message:`Request timeout!`
                    })
                }else{
                    setFormMessage({
                        type:"error",
                        message: err.response.data.message
                    })
                }
            });

        }else{
            setFormMessage({
                type:"error",
                message: 'Another Request in Progress! wait for that one to finish!'
            })
        }
    }
    const handleUpdateCounter = function(){
        if (!requesting){
            if (counterValid()){
                setRequesting (true);
                var base = (process.env.NODE_ENV==='development')
                ? process.env.REACT_APP_API_URL
                : window.location.origin

                axios({
                    method: "put",
                    url: base+"/v1/current",
                    headers:{
                        "Authorization":`Bearer ${token}`
                    },
                    data:{"current":counter}
                })
                .then(function(res){
                    
                    setFormMessage({
                        type:"success",
                        message: `Current Counter Value is => ${counter}`
                    })
                    setRequesting (false);

                }).catch(function(err){
                    setRequesting (false);
                    if (typeof(err.response)=="undefined"){
                        setFormMessage({
                            type:"error",
                            message:`Request timeout!`
                        })
                    }else{
                        setFormMessage({
                            type:"error",
                            message: err.response.data.message
                        })
                    }
                });
            }
        }else{
            setFormMessage({
                type:"error",
                message: 'Another Request in Progress! wait for that one to finish!'
            })
        }
    }

    const counterValid = function(){
        if (
            (counter.length>0) && (!isNaN(counter))){
            return true;
        }else{
            setFormMessage({
                type:"error",
                message: 'Counter value is not a Number'
            })
            return false;
        }
    }

    const handleLogout = function(){
        deleteToken();
        setLoggedin(false);
        setToken('');
    }

    const deleteToken = function(){
        window.localStorage.removeItem('token');
    }
    return (
        loading
        ?'...Loading...'
        :(
        <div className="appWrapper">
            <div className="formWrapper">
                <div className="vrow">
                    <div className={"headerMessage "+formMessage.type}>
                        {formMessage.message}
                    </div>
                </div>
                <div className="body">
                    <div className="vrow">
                        <div className="formTextGroup">
                            <input className="formTextbox" type="text" placeholder="Counter" 
                            onChange={(e)=>handleCounterChange(e)}
                            value={counter}/>
                                
                        </div>
                    </div>
                    
                    <div className="vrow">
                        <button className="formButton" onClick = {()=>handleUpdateCounter()}>Update Counter Value</button>
                    </div>
                    <div className="vrow">
                        <button className="formButton" onClick = {()=>handleCurrentCounter()}>Current Counter</button>
                    </div>
                    <div className="vrow">
                        <button className="formButton" onClick = {()=>handleNextCounter()}>Next Counter</button>
                    </div>
                    <div className="vrow">
                        <button className="formButtonGoogle" onClick = {()=>handleLogout()}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
        )
    )
}

export default Dashboard;
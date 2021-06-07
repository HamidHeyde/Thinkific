import {Link} from 'react-router-dom';
import React, {useState,useEffect,useContext} from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import {AuthContext} from '../context/AuthContext';
import './register.css'
import eye from '../assets/images/eye.svg'
import eyeSlash from '../assets/images/eyeSlash.svg'

const Register = function(){
    let history = useHistory();
    let {setLoggedin,setToken} = useContext(AuthContext);

    const [formMessage,setFormMessage]=useState({
        type:'noMessage',
        message:'Register A User'
    })
    const [formPassword, setFormPassword] = useState({
        type:"password",
        image:eyeSlash
    });
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false)
    const [formData,setFormData]=useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        setLoading(true);
        
        var storageToken = window.localStorage.getItem('token');
        if(storageToken){
            var token = JSON.parse(storageToken);
            setLoggedin(true);
            setToken(token);
            history.push('/dashboard')
        }
        
        setLoading(false);
    }, [])

    const handleEyeSwitch = function(){
        setFormPassword({
            type:(formPassword.type==='password')?"text":'password',
            image:(formPassword.type==='password')?eye:eyeSlash
        })
    }
    const handleFormChange = function(fieldName){
        return function (e){
            setFormData({ 
                ...formData, 
                [fieldName]: e.target.value 
            });
        }
    }

    const handleRegisterButton = function(){ 
        if (!requesting){
            if (formDataValid()){
                
                setRequesting (true);
                var base = (process.env.NODE_ENV==='development')
                ? process.env.REACT_APP_API_URL
                : window.location.origin

                axios({
                    method: "post",
                    url: base+"/v1/registerUser",
                    data:formData
                })
                .then(function(res){
                    setRequesting (false);
                    setFormData({
                        email:'',
                        password:''
                    })
                    setFormMessage({
                        type:"success",
                        message:`success Congrats! User Registered successfully`
                    })

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
    
    const formDataValid = function(){
        if (emailValid() && passwordValid()){
            setFormData({
                email:formData.email.trim(),
                password:formData.password.trim(),
            })
            return true;
        }
        return false;
    }

    const passwordValid = function(){
        if (formData.password.length>0){
                // console.log(formData.password.length)
                return true;
        }
        setFormMessage({
            type:"error",
            message:`Password Not Valid!`
        })
        return false;
    }
    const emailValid = function(){
        if (formData.email.length>0){
            if (formData.email.indexOf('@')>-1){
                if((formData.email.split('@')[1]).indexOf('.')>-1){
                    return true;
                }
            }
        }
        setFormMessage({
            type:"error",
            message:`Email is not valid!`
        })
        return false;
    }

    

    return (
        loading
        ? '....loading....'
        :
        (
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
                            <input className="formTextbox" type="email" placeholder="Email" 
                            onChange={handleFormChange('email')}
                            value={formData.email}/>
                                
                        </div>
                    </div>

                    <div className="vrow">
                        <div className="formTextGroup">
                            <input className="formTextbox" type={formPassword.type} placeholder="Password" 
                            onChange={handleFormChange('password')}
                            value={formData.password}/>

                            <div className="passwordEye">
                                <img src={formPassword.image} className="passwordEyeImage" 
                                onClick={()=> handleEyeSwitch()}/>
                            </div>
                        </div>
                    </div>
                    
                    <div className="vrow">
                        <button className="formButton" onClick = {()=>handleRegisterButton()}>Sign up</button>
                    </div>
                    <div className="vrow">
                        <div className="formSubtitle">
                            Already have an account? 
                            <Link to="/" className="formLink">Sign in</Link>
                        </div>
                    </div>
                    {/* <div className="vrow">
                        <button className="formButtonGoogle">Sign in with Google</button>
                    </div>
                    <div className="vrow">
                        <button className="formButtonGoogle">Sign in with Facebook</button>
                    </div> */}
                </div>
            </div>
        </div>
        )
    )
}

export default Register;
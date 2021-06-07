import {Link} from 'react-router-dom';
import React, {useState,useContext, useEffect} from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import {AuthContext} from '../context/AuthContext';
import './register.css';
import eye from '../assets/images/eye.svg';
import eyeSlash from '../assets/images/eyeSlash.svg';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

const Login = function(){

    // useEffect
    let {setLoggedin,setToken} = useContext(AuthContext);
    let history = useHistory();

    const [formMessage,setFormMessage]=useState({
        type:'noMessage',
        message:'Login'
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
    const handleGotoRegistration = function(){
        history.push('/register');
    }

    const handleLoginButton = function(){ 
        if (!requesting){
            if (formDataValid()){
                
                setRequesting (true);
                var base = (process.env.NODE_ENV==='development')
                ? process.env.REACT_APP_API_URL
                : window.location.origin

                axios({
                    method: "post",
                    url: base+"/v1/loginUser",
                    data:formData
                })
                .then(function(res){
                    setFormData({
                        email:'',
                        password:''
                    })
                    setFormMessage({
                        type:"success",
                        message: `Congrats! Logged in Successfully`
                    })
                    setRequesting (false);
                    setLoggedin(true);
                    const token = res.data.message;
                    setToken(token);
                    saveToken(token);
                    history.push('/dashboard')

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
            // console.log(formData.email.length)
            if (formData.email.indexOf('@')>-1){
                // console.log(formData.email.indexOf('@'))
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

    const saveToken = function(token){
        window.localStorage.setItem('token',JSON.stringify(token));
    }
    
    const handleLogin = function(response){
        // console.log(response)
        // console.log(response.accessToken)
        // console.log(response.tokenId)
        setRequesting (true);
                var base = (process.env.NODE_ENV==='development')
                ? process.env.REACT_APP_API_URL
                : window.location.origin

                axios({
                    method: "post",
                    url: base+"/v1/google",
                    data:{"idToken":response.tokenId}
                })
                .then(function(res){
                    setFormMessage({
                        type:"success",
                        message: `Congrats! Logged in Successfully`
                    })
                    setRequesting (false);
                    setLoggedin(true);
                    const token = res.data.message;
                    setToken(token);
                    saveToken(token);
                    history.push('/dashboard')

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
    const responseFacebook = function(response){
        setRequesting (true);
                var base = (process.env.NODE_ENV==='development')
                ? process.env.REACT_APP_API_URL
                : window.location.origin

                axios({
                    method: "post",
                    url: base+"/v1/facebook",
                    data:{
                        "userId":response.userID,
                        "accessToken":response.accessToken

                    }
                })
                .then(function(res){
                    setFormMessage({
                        type:"success",
                        message: `Congrats! Logged in Successfully`
                    })
                    setRequesting (false);
                    setLoggedin(true);
                    const token = res.data.message;
                    setToken(token);
                    saveToken(token);
                    history.push('/dashboard')

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


    return (
        loading
        ?'....loading'
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
                        <button className="formButton" onClick = {()=>handleLoginButton()}>Login</button>
                    </div>
                    <div className="vrow">
                        <div className="formSubtitle">
                            Do not have an account? 
                            <Link to="/register" className="formLink">Register</Link>
                        </div>
                    </div>
                    {/* <div className="vrow">
                        <button className="formButtonGoogle">Sign in with Facebook</button>
                    </div> */}
                    <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        buttonText="Log in with Google"
                        onSuccess={handleLogin}
                        onFailure={handleLogin}
                        cookiePolicy={'single_host_origin'}
                        render={renderProps=>(
                            <div className="vrow">
                                <button 
                                className="formButtonGoogle"
                                onClick={renderProps.onClick}
                                >Sign in with Google</button>
                            </div> 
                        )}
                    />

                    <FacebookLogin
                    appId={`${process.env.REACT_APP_FACEBOOK_CLIENT_ID}`}
                    autoLoad={false}
                    callback={responseFacebook}
                    render={renderProps => (
                        <div className="vrow">
                            <button 
                            className="formButtonGoogle"
                            onClick={renderProps.onClick}
                            >Sign in with Facebook</button>
                        </div>
                    )}
                />
                </div>
            </div>
        </div>
        ))
}

export default Login;
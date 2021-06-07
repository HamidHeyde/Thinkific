import React, {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {Redirect} from 'react-router-dom';

const ProtectedRoute = function({children, ...rest}){
    const {loggedin} = useContext(AuthContext);
    return(
        <>
        {loggedin? children : <Redirect to="/" />}
        </>
    )
    
}

export default ProtectedRoute;
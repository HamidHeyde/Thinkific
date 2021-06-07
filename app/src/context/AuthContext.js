import React, {useState, createContext} from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = function(props){

    const [loggedin, setLoggedin] = useState(false);
    const [token, setToken] = useState('');

    return(
        <AuthContext.Provider value={{
            loggedin, setLoggedin, token, setToken
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}
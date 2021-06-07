import React, {
    Fragment
} from 'react';
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute'
import Login from '../screens/Login';
import Register from '../screens/Register';
import Dashboard from '../screens/Dashboard';
import NotFound from '../screens/NotFound';

//The Application Routes
export const routes = [
    {
        protected:false,
        exact:true,
        path:'/',
        component: Login

    },
    {
        protected:false,
        exact:true,
        path:'/login',
        component: Login
    },
    {
        protected:false,
        exact:true,
        path:'/Register',
        component: Register
    },
    {
        protected:true,
        exact:true,
        path:'/Dashboard',
        component: Dashboard
    },
    {
        protected:false,
        exact:true,
        path:'/404',
        component: NotFound
    },
    {
        protected:false,
        exact:false,
        path:'*',
        component: ()=><Redirect to="/" />
    },
    
];

//Route Renderer
export const routRenderer = function(routes=[]){
    
    return(
            <Switch>
                {   
                    routes.map(function(value,index){
                        const Component = value.component;
                        const Guard = value.protected ? ProtectedRoute : Fragment;
                        return <Route 
                                    key={index} 
                                    exact={value.exact}
                                    path={value.path}
                                    render={(props) => (
                                        <Guard>
                                            <Component {...props} />
                                        </Guard>
                                    )}
                                    />
                    })
                }
            </Switch>
    )
    
}
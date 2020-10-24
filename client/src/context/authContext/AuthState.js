import React ,{ useReducer } from 'react';
import authReducer from "./AuthReducer"
import AuthContext from './AuthContext';
import { LOGIN, LOGOUT } from "../types"
import jwt from 'jsonwebtoken'

const initialState = {
    user: null
}

if (localStorage.getItem('token')) {
    const decodedToken = jwt.decode(localStorage.getItem('token'))
    if(decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
    }
    else {
        initialState.user = decodedToken
    }
}

const AuthState = (props) => {
    
    const [state, dispatch] = useReducer(authReducer, initialState)
    
    const login = (userData) => {
        dispatch({
            type: LOGIN,
            payload: userData
        })
    }
    
    const logout = () => {
        dispatch({
            type: LOGOUT
        })
    }
    
    return (
        <AuthContext.Provider value={{user: state.user, login, logout}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthState
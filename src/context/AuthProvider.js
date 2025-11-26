import { createContext, useState, useEffect } from "react";

import { decodeToken } from "react-jwt";

const { REACT_APP_API_URL, REACT_APP_LOGIN } = process.env;
const API_URL = REACT_APP_API_URL+"auth";

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState();

    const logout = () => {
        localStorage.removeItem("token");
        window.location.replace('/auth/login');
    };

    /*const isAuthenticated = () => {
        return (getCurrentUser()) ? true : false;
    };*/

    const isAuthenticated = () => {
        const user = getCurrentUser();
        if (user) {
            return !checkTokenExpiry();
        }
        return false;
    };

    const getCurrentUser = () => {
        let token = localStorage.getItem("token");
        if(token){
            return JSON.parse(token);
        }else{
            return false;
        }
    };

    /*const getDecodeToken = () => {
        return decodeToken(getCurrentUser());
    }*/

    const getDecodeToken = () => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            return decodeToken(currentUser);
        }
        return null;
    };

    const getNameUser = () => {
        let decode = getDecodeToken();
        return decode?.sub ? decode.sub : "";
    }

    const getTipoUser = () => {
        let decode = getDecodeToken();
        return decode?.tipoUsuario ? decode.tipoUsuario : "";
    }

    const getNameRole = () => {
        let decode = getDecodeToken();
        return decode?.roles ? decode.roles : "";
    }

    /*const getExpToken = () => {
        let decode = getDecodeToken();
        return decode.exp;
    }*/

    const getExpToken = () => {
        let decode = getDecodeToken();
        if (decode && decode.exp) {
            return decode.exp;
        }
        return null;
    };

    const getPermissions = () => {
        let decode = getDecodeToken();
        return decode?.permissions;
    }

    const validatePermission = (roles) => {
        let contador;
        let permissions = getPermissions();
        let exist = false
        if(!roles){
            exist = true;
        }else if(roles.length > 0){
        roles.map((role, key) => {
            contador = permissions.filter(permission => permission.includes(role)).map(filteredPermission => (
                filteredPermission
            ));
            if(contador.length > 0){
                exist = true;
            }
        });
        }
        return exist;
    }

    /*const checkTokenExpiry = () => {
        let timeExpired = getExpToken();
        let expired =  (timeExpired-1000) < ((Date.now() - 1000 * 60 * 5) / 1000);
        if (expired) {
            localStorage.removeItem("token_hensall_energy");
            window.location.replace(REACT_APP_LOGIN);
            //window.location.href = "/auth/login";
        }  
    }*/

    const checkTokenExpiry = () => {
        const timeExpired = getExpToken();
        if (timeExpired) {
            const isExpired = (timeExpired-1000) < ((Date.now() - 1000 * 60 * 5) / 1000);
            if (isExpired) {
                localStorage.removeItem("token");
                window.location.replace(REACT_APP_LOGIN);
            }
            return isExpired;
        }
        return true; // Si no se puede obtener `exp`, considera que el token no es válido.
    };
      
    // const checkTokenExpiry = () => {
    //     return new Promise((resolve,reject)=>{
    //       let timeExpired = getExpToken();
    //       let expired =  (timeExpired-1000) < ((Date.now() - 1000 * 60 * 5) / 1000);
    //       if (expired) {
    //         localStorage.removeItem("token");
    //         window.location.href = "/auth/login";
    //       }  
    //       resolve();
    //     });
    // }

    const data = {auth, setAuth, logout, isAuthenticated, getNameUser, getNameRole, checkTokenExpiry, 
        getCurrentUser, validatePermission, getTipoUser };
    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
}

export default AuthContext;
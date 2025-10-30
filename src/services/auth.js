//import axios from "axios";
import { decodeToken } from "react-jwt";

const { REACT_APP_API_URL } = process.env;
const API_URL = REACT_APP_API_URL+"auth";

const login = (data) => {
  //return axios
    //.post(API_URL + "/login", data)
    //.then((response) => {
      //if (response.data.access_token) {
        //localStorage.setItem("token_hensall_energy", JSON.stringify(response.data.access_token));
      //}

      //return response.data;
    //});
};

const logout = () => {
  localStorage.removeItem("token_hensall_energy");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("token_hensall_energy"));
};

const getDecodeToken = () => {
  return decodeToken(getCurrentUser());
}

const getNameUser = () => {
  let decode = getDecodeToken();
  return decode?.sub ? decode.sub : "";
}

const getExpToken = () => {
  let decode = getDecodeToken();
  return decode.exp;
}

const checkTokenExpiry = () => {
  return new Promise((resolve,reject)=>{
    let timeExpired = getExpToken();
    let expired =  (timeExpired-1000) < ((Date.now() - 1000 * 60 * 5) / 1000);
    if (expired) {
      localStorage.removeItem("token_hensall_energy");
      window.location.href = "/auth/login";
    }  
    resolve();
  });
}

const authService = {
  login,
  logout,
  getCurrentUser,
  getDecodeToken,
  getNameUser,
  checkTokenExpiry
};

export default authService;
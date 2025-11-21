import { createContext, useContext } from "react";
import { helpHttp } from "helpers/helpHttp";
import NotificationContext from "context/NotificationContext";
import LoadingContext from "context/LoadingContext";
import { useNavigate } from "react-router";

const LoginContext = createContext();

const LoginProvider = ({children}) => {

    const { setMessage, setStatus, setType } = useContext(NotificationContext);
    const { setLoading } = useContext(LoadingContext);

    let api = helpHttp();
    const { REACT_APP_API_URL_LOGIN } = process.env;
    let url = REACT_APP_API_URL_LOGIN+"login";


    const navigate = useNavigate();

    const login = (data) => {
            setLoading(true);
            let endpoint = url;
            let newData = data;

            let options = {
                body: newData,
                headers: {"content-type":"application/json"}
            }
            api.post(endpoint, options).then((res) => {
                if(!res.err){
                    localStorage.setItem("token", JSON.stringify(res.token));
                    navigate('/admin/dashboard/');
                    setType("success");
                    setMessage("Inicio de sesión exitoso");
                    setStatus(1);
                }else{
    
                }
                setLoading(false);
            })
        }

    const data = { login };
    return <LoginContext.Provider value={data}>{children}</LoginContext.Provider>;
}

export { LoginProvider };
export default LoginContext;
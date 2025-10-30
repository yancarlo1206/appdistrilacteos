import { createContext, useState, useContext, useEffect } from "react";
import NotificationContext from "context/NotificationContext";

const InternetConnectionContext = createContext();

const InternetConnectionProvider = ({children}) => {

    const { setMessage, setStatus, setType } = useContext(NotificationContext);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        if(!isOnline){
            setType("danger");
            setMessage("Offline: It appears you have lost internet connection. Some features will be disabled while offline");
            setStatus(1);
        }else{
            //setType("success");
            //setMessage("Offline: It appears you have lost internet connection. Some features will be disabled while offline");
            //setStatus(1);
        }
    },[isOnline]);

    const data = { setIsOnline };

    return <InternetConnectionContext.Provider value={data}>{children}</InternetConnectionContext.Provider>;
}

export { InternetConnectionProvider };
export default InternetConnectionContext;
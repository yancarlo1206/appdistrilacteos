import { createContext, useState } from "react";

const NotificationContext = createContext();

const NotificationProvider = ({children}) => {

    const [status, setStatus] = useState(0);
    const [message, setMessage] = useState();
    const [type, setType] = useState();
    const data = { status, type, message, setMessage, setStatus, setType };
    return <NotificationContext.Provider value={data}>{children}</NotificationContext.Provider>;
}

export { NotificationProvider };
export default NotificationContext;
import { helpHttp } from "helpers/helpHttp";
import {
    createContext,
    useContext,
    useEffect,
    useReducer,
    useState,
} from "react";
import { TYPES } from "actions/genericAction";
import {
    genericReducer,
    genericInitialState,
} from "../reducers/genericReducer";
import NotificationContext from "context/NotificationContext";
import LoadingContext from "context/LoadingContext";
import { useNavigate } from "react-router";

const TicketContext = createContext();

const TicketProvider = ({ children }) => {
    const [toDetail, setToDetail] = useState();
    const [toUpdate, setToUpdate] = useState();
    const [detail, setDetail] = useState({});
    const [module, setModule] = useState();

    const [prioridades, setPrioridades] = useState([]);
    const [tipoTickets, setTipoTickets] = useState([]);
    const [estadoTickets, setEstadoTickets] = useState([]);

    const navigate = useNavigate();
    const { REACT_APP_API_URL } = process.env;

    const { setMessage, setStatus, setType } = useContext(NotificationContext);
    const { setLoading } = useContext(LoadingContext);

    const [state, dispatch] = useReducer(genericReducer, genericInitialState);
    const { db } = state;

    let api = helpHttp();
    let url = REACT_APP_API_URL + "ticket";

    useEffect(() => {
        fetchData();
        fetchDataPrioridades();
        fetchDataTipoTickets();
        fetchDataEstadoTickets();
    }, []);

    useEffect(() => {
        if (toUpdate && toUpdate != 0) {
            fetchDataDetail();
        }
    }, [toUpdate]);

    const fetchData = () => {
        setLoading(true);
        api.get(url).then((res) => {
            if (!res.err) {
                dispatch({ type: TYPES.READ_ALL_DATA, payload: res.data });
            } else {
                dispatch({ type: TYPES.NO_DATA });
            }
            setLoading(false);
        });
    };


    const fetchDataDetail = () => {
        setLoading(true);
        url = url + "/" + toUpdate;
        api.get(url).then((res) => {
            const detail = {
                ...res.data,
                prioridad: res.data?.prioridad?.id ?? null,
                tipo: res.data?.tipo?.id ?? null,
                estado: res.data?.estado?.id ?? null,
            };
            setDetail(detail);
            setLoading(false);
        });
    };

    const fetchDataPrioridades = () => {
        let urlFetch = REACT_APP_API_URL + "ticketprioridad";
        api.get(urlFetch).then((res) => {
            var data = res.data.map(function (obj) {
                obj.text = obj.text || obj.descripcion;
                return obj;
            });
            setPrioridades(data);
        });
    };

    const fetchDataTipoTickets = () => {
        let urlFetch = REACT_APP_API_URL + "tickettipo";
        api.get(urlFetch).then((res) => {
            var data = res.data.map(function (obj) {
                obj.text = obj.text || obj.descripcion;
                return obj;
            });
            setTipoTickets(data);
        });
    };

    const fetchDataEstadoTickets = () => {
        let urlFetch = REACT_APP_API_URL + "ticketestado";
        api.get(urlFetch).then((res) => {
            var data = res.data.map(function (obj) {
                obj.text = obj.text || obj.descripcion;
                return obj;
            });
            setEstadoTickets(data);
        });
    };

    const saveData = (data) => {
        setLoading(true);
        let endpoint = url;

        const newData = {
            ...data,
            prioridad: { id: data.prioridad },
            tipo: { id: data.tipo },
            estado: { id: data.estado }
        };

        let options = {
            body: newData,
            headers: { "content-type": "application/json" },
        };

        api.post(endpoint, options).then((res) => {
            if (!res.err) {
                dispatch({ type: TYPES.CREATE_DATA, payload: res.data });
                navigate("/admin/ticket/");
                setType("success");
                setMessage("El Ticket se guardo correctamente");
                setStatus(1);
            } else {
            }
            setLoading(false);
        });
    };

    const updateData = (data) => {
        setLoading(true);
        let endpoint = url + "/" + data.id;

        const newData = {
            ...data,
            prioridad: { id: data.prioridad },
            tipo: { id: data.tipo },
            estado: { id: data.estado }
        };

        delete newData.id;

        let options = {
            body: newData,
            headers: { "content-type": "application/json" },
        };

        api.put(endpoint, options).then((res) => {
            if (!res.err) {
                setDetail(res.data);
                dispatch({ type: TYPES.UPDATE_DATA, payload: res.data });
                navigate("/admin/ticket");
                setType("success");
                setMessage("El Ticket se actualizo correctamente");
                setStatus(1);
            } else {
            }
            setLoading(false);
        });
    };

    const deleteData = (id) => {
        setLoading(true);
        let endpoint = url + "/" + id;
        let options = {
            body: "",
            headers: { "content-type": "application/json" },
        };
        api.del(endpoint, options).then((res) => {
            if (!res.err) {
                dispatch({ type: TYPES.DELETE_DATA, payload: id });
                setType("success");
                setMessage("El Ticket se elimino correctamente");
                setStatus(1);
            } else {
                setType("danger");
                setMessage(res.message.message);
                setStatus(1);
            }
            setLoading(false);
        });
    };

    const data = {
        db,
        detail,
        setToDetail,
        setToUpdate,
        updateData,
        saveData,
        deleteData,
        module,
        setModule,
        setDetail,
        prioridades,
        tipoTickets,
        estadoTickets,
    };

    return (
        <TicketContext.Provider value={data}>{children}</TicketContext.Provider>
    );
};

export { TicketProvider };
export default TicketContext;

import { helpHttp } from "helpers/helpHttp";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import NotificationContext from "context/NotificationContext";
import LoadingContext from "context/LoadingContext";
import { useNavigate } from "react-router";

const RegistroContext = createContext();

const RegistroProvider = ({ children }) => {

    const [detail, setDetail] = useState({});

    const [tipoDocumentos, setTipoDocumentos] = useState([]);
    const [ciudades, setCiudades] = useState([]);

    const navigate = useNavigate();
    const { REACT_APP_API_URL } = process.env;

    const { setMessage, setStatus, setType } = useContext(NotificationContext);
    const { setLoading } = useContext(LoadingContext);

    let api = helpHttp();
    let url = REACT_APP_API_URL + "cliente";

    useEffect(() => {
        fetchDataTipoDocumentos();
        fetchDataCiudades();
    }, []);

    const fetchDataTipoDocumentos = () => {
        let urlFetch = REACT_APP_API_URL + "tipodocumento";
        api.get(urlFetch).then((res) => {
            var data = res.data.map(function (obj) {
                obj.text = obj.text || obj.descripcion;
                return obj;
            });
            setTipoDocumentos(data);
        });
    };

    const fetchDataCiudades = () => {
        let urlFetch = REACT_APP_API_URL + "ciudad";
        api.get(urlFetch).then((res) => {
            var data = res.data.map(function (obj) {
                obj.text = obj.text || obj.descripcion;
                return obj;
            });
            setCiudades(data);
        });
    };

    const saveData = (data) => {

        setLoading(true);
        let endpoint = url;

        const newData = {
            ...data,
            tipoDocumento: { id: data.tipoDocumento },
            ciudad: { id: data.ciudad },
            clienteEstado: { id: 1 },
        };

        let options = {
            body: newData,
            headers: { "content-type": "application/json" }
        }
        api.post(endpoint, options).then((res) => {
            if (!res.err) {
                navigate('/auth/login');
                setType("success");
                setMessage("El Registro del Cliente se realizo correctamente");
                setStatus(1);
            } else {
                setType("danger");
                setMessage("El Registro del Cliente no se pudo realizar");
                setStatus(0);
            }
            setLoading(false);
        })
    }

    const data = {
        saveData, detail, tipoDocumentos, ciudades,
    };

    return <RegistroContext.Provider value={data}>{children}</RegistroContext.Provider>;
}

export { RegistroProvider };
export default RegistroContext;
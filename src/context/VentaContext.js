import { helpHttp } from "helpers/helpHttp";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { TYPES } from "actions/genericAction";
import { genericReducer, genericInitialState } from "../reducers/genericReducer";
import NotificationContext from "context/NotificationContext";
import LoadingContext from "context/LoadingContext";
import { useNavigate } from "react-router";

const VentaContext = createContext();

const VentaProvider = ({children}) => {

    const [toDetail, setToDetail] = useState();
    const [toUpdate, setToUpdate] = useState();
    const [detail, setDetail] = useState({});
    const [module, setModule] = useState();
    const [clientes, setClientes] = useState([]);
    const [articulos, setArticulos] = useState([]);

    const [articulosVenta, setArticulosVenta] = useState([]);
    const [articulosVentaEnviar, setArticulosVentaEnviar] = useState([]);

    const [verModalArticulo, setVerModalArticulo] = useState();

    const navigate = useNavigate();
    const { REACT_APP_API_URL } = process.env;

    const { setMessage, setStatus, setType } = useContext(NotificationContext);
    const { setLoading } = useContext(LoadingContext);

    const [state, dispatch] = useReducer(genericReducer, genericInitialState);
    const { db } = state;

    let api = helpHttp();
    let url = REACT_APP_API_URL+"venta";

    useEffect(() => {
        fetchData();
        fetchDataClientes();
        fetchDataArticulos();
    },[]);

    useEffect(() => {
        if(toUpdate && toUpdate != 0){
            fetchDataDetail();
        }
    },[toUpdate]);

    const fetchData = () => {
        setLoading(true);
         api.get(url).then((res) => {
            if(!res.err){
                dispatch({ type: TYPES.READ_ALL_DATA, payload: res.data });
            }else{
                dispatch({ type: TYPES.NO_DATA });
            }
            setLoading(false);
        });
    };

    const fetchDataDetail = () => {
        setLoading(true);
        url = url+"/"+toUpdate;
        api.get(url).then((res) => {
            res.data.cliente = res.data.cliente.id;
            setDetail(res.data);
            setArticulosVenta(res.data.detalles);
            setArticulosVentaEnviar(res.data.detalles);
            setLoading(false);
        });
    };

    const fetchDataClientes = () => {
        let urlFetch = REACT_APP_API_URL+"cliente";
        api.get(urlFetch).then((res) => {
            var data = res.data.map(function (obj) {
                obj.text = obj.text || obj.nombre;
                return obj;
            });
            setClientes(data);
        });
    };

    const fetchDataArticulos = () => {
        let urlFetch = REACT_APP_API_URL+"articulo";
        api.get(urlFetch).then((res) => {
            var data = res.data.map(function (obj) {
                obj.text = obj.text || obj.nombre;
                return obj;
            });
            setArticulos(data);
        });
    };

    const saveData = (data) => {

        setLoading(true);
        let endpoint = url;
        let cliente = {id: data.cliente}

        let newData = {
            ...data,
            cliente,
            detalles: articulosVentaEnviar
        };
        
        let options = {
            body: newData,
            headers: {"content-type":"application/json"}
        }

        api.post(endpoint, options).then((res) => {
            if(!res.err){
                dispatch({ type: TYPES.CREATE_DATA, payload: res.data });
                navigate('/admin/venta/');
                setType("success");
                setMessage("El registro se guardo correctamente");
                setStatus(1);
            }else{

            }
            setLoading(false);
        })

    }

    const updateData = (data) => {

        setLoading(true);
        let endpoint = url+"/"+data.id;
        let cliente = {id: data.cliente}

        let { id, fecha, ...rest } = data;
    
        let newData = {
            ...rest,
            cliente,
            detalles: articulosVentaEnviar.map(item => {
                let { id, articulo, ...itemRest } = item;
                let { caracteristicas, ...articuloRest } = articulo;
                return {
                    ...itemRest,
                    articulo: articuloRest
                };
            })
        };

        let options = {
            body: newData,
            headers: {"content-type":"application/json"}
        }

        api.put(endpoint, options).then((res) => {
            if(!res.err){
                setDetail(res.data);
                dispatch({ type: TYPES.UPDATE_DATA, payload: res.data });
                navigate('/admin/venta');
                setType("success");
                setMessage("El registro se actualizo correctamente");
                setStatus(1);
            }else{

            }
            setLoading(false);
        })
        
    }

    const deleteData = (id) => {
        setLoading(true);
        let endpoint = url+"/"+id;
        let options = {
            body: "",
            headers: {"content-type":"application/json"}
        }
        api.del(endpoint, options).then((res) => {
            if(!res.err){
                dispatch({ type: TYPES.DELETE_DATA, payload: id });
                setType("success");
                setMessage("The registry was deleted correctly");
                setStatus(1);
            }else{
                setType("danger");
                setMessage(res.message.message);
                setStatus(1);
            }
            setLoading(false);
        });
    }

    const addArticuloVenta = (data) => {
        setLoading(true);
        let exist = false;
        articulosVenta.map((el) => {
            if(el.articulo === data.articulo){
                exist = true;
                return;
            }
        });
        console.log(data);
        if(exist){
            setType("danger");
            setMessage("El Articulo ya existe");
            setStatus(1);
            setLoading(false);
            return;
        }else{
            setArticulosVenta((articulosVenta) => {
                return [...articulosVenta, {"articulo":data.articulo, "articulo_text":data.articulo_text, "cantidad": data.cantidad,"valor_unitario": data.valor_unitario,"valor": data.valor}]
            })
            setArticulosVentaEnviar((articulosVentaEnviar) => {
                let articulo = {id:data.articulo};
                return [...articulosVentaEnviar, {"articulo":articulo, "cantidad": data.cantidad,"valor_unitario": data.valor_unitario,"valor": data.valor}]
            })
        }
        setLoading(false);
    }

    const deleteArticuloVenta = (id_articulo) => {
        setLoading(true);
        let newData = articulosVenta.filter((el) => el.articulo !== id_articulo);
        let newDataSend = articulosVentaEnviar.filter((el) => el.articulo !== id_articulo);
        setArticulosVenta(newData);
        setArticulosVentaEnviar(newDataSend);
        setLoading(false);
    }

    const data = { 
        db, detail, setToDetail, setToUpdate, updateData, saveData, deleteData, module, 
        setModule, setDetail, clientes, articulosVenta, setArticulosVenta, articulos, 
        verModalArticulo, setVerModalArticulo, addArticuloVenta, deleteArticuloVenta, setArticulosVentaEnviar 
    };

    return <VentaContext.Provider value={data}>{children}</VentaContext.Provider>;
}

export { VentaProvider };
export default VentaContext;
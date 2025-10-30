import { helpHttp } from "helpers/helpHttp";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { TYPES } from "actions/genericAction";
import { genericReducer, genericInitialState } from "../reducers/genericReducer";
import NotificationContext from "context/NotificationContext";
import LoadingContext from "context/LoadingContext";
import { useNavigate } from "react-router";

const ArticuloContext = createContext();

const ArticuloProvider = ({children}) => {

    const [toDetail, setToDetail] = useState();
    const [toUpdate, setToUpdate] = useState();
    const [detail, setDetail] = useState({});
    const [module, setModule] = useState();
    const [categorias, setCategorias] = useState([]);

    const [caracteristicas, setCaracteristicas] = useState([]);
    const [articuloCaracteristicas, setArticuloCaracteristicas] = useState([]);

    const [verModalCaracteristica, setVerModalCaracteristica] = useState();

    const navigate = useNavigate();
    const { REACT_APP_API_URL } = process.env;

    const { setMessage, setStatus, setType } = useContext(NotificationContext);
    const { setLoading } = useContext(LoadingContext);

    const [state, dispatch] = useReducer(genericReducer, genericInitialState);
    const { db } = state;

    let api = helpHttp();
    let url = REACT_APP_API_URL+"cliente";

    useEffect(() => {
        fetchDataArticulos();
        //fetchData();
        //fetchDataCategorias();
    },[]);

    useEffect(() => {
        if(toUpdate && toUpdate != 0){
            //fetchDataDetail();
            fecthDataArticulosDetalle();
        }
    },[toUpdate]);

    useEffect(() => {
        if(verModalCaracteristica){
            fetchDataCaracteristicas();
        }
    },[verModalCaracteristica])

    const fecthDataArticulosDetalle = () => {
        setLoading(true);
        let data = {
            id: 2,
            nombre: "Lavadora Carga Frontal",
            descripcion: "15 kg de capacidad, 12 ciclos de lavado y tecnología de bajo consumo energético.",
            cantidad: 12,
            categoria: 1,
            estado: "Activo"
          }
        setDetail(data);
        setLoading(false);
    }

    const fetchDataArticulos = () => {
        setLoading(true);   
        
        let data = [
            {
              id: 1,
              nombre: "Refrigerador Side-by-Side",
              descripcion: "Nevera con dispensador de agua y hielo, capacidad de 600 litros.",
              cantidad: 5,
              categoria: {
                id: 1,
                descripcion: "Línea Blanca y Refrigeración"
              },
              estado: "Activo"
            },
            {
              id: 2,
              nombre: "Lavadora Carga Frontal",
              descripcion: "15 kg de capacidad, 12 ciclos de lavado y tecnología de bajo consumo energético.",
              cantidad: 12,
              categoria: {
                id: 1,
                descripcion: "Línea Blanca y Refrigeración"
              },
              estado: "Activo"
            },
            {
              id: 3,
              nombre: "Horno Microondas Digital",
              descripcion: "25 litros de capacidad, 10 niveles de potencia y función de descongelamiento rápido.",
              cantidad: 20,
              categoria: {
                id: 2,
                descripcion: "Cocina y Preparación de Alimentos"
              },
              estado: "Activo"
            },
            {
              id: 4,
              nombre: "Aspiradora Robot Inteligente",
              descripcion: "Navegación láser, mapeo de múltiples pisos y control por app móvil.",
              cantidad: 8,
              categoria: {
                id: 3,
                descripcion: "Limpieza y Cuidado del Hogar"
              },
              estado: "Activo"
            },
            {
              id: 5,
              nombre: "Cafetera de Goteo Programable",
              descripcion: "12 tazas, filtro permanente y función de mantener caliente por 4 horas.",
              cantidad: 18,
              categoria: {
                id: 2,
                descripcion: "Cocina y Preparación de Alimentos"
              },
              estado: "Activo"
            },
            {
              id: 6,
              nombre: "Licuadora de Alta Potencia",
              descripcion: "Motor de 1500W, vaso de vidrio de 2 litros y 3 programas preestablecidos.",
              cantidad: 15,
              categoria: {
                id: 2,
                descripcion: "Cocina y Preparación de Alimentos"
              },
              estado: "Activo"
            },
            {
              id: 7,
              nombre: "Secadora de Ropa con Sensor",
              descripcion: "Secado por sensores de humedad, capacidad de 10 kg, reduce arrugas.",
              cantidad: 7,
              categoria: {
                id: 1,
                descripcion: "Línea Blanca y Refrigeración"
              },
              estado: "Activo"
            },
            {
              id: 8,
              nombre: "Tostador de Pan 4 Rebanadas",
              descripcion: "Ranuras extra anchas, 7 niveles de tostado y botones de descongelar/recalentar.",
              cantidad: 25,
              categoria: {
                id: 2,
                descripcion: "Cocina y Preparación de Alimentos"
              },
              estado: "Activo"
            },
            {
              id: 9,
              nombre: "Calentador de Ambiente Cerámico",
              descripcion: "2000W de potencia, termostato ajustable y protección contra sobrecalentamiento.",
              cantidad: 10,
              categoria: {
                id: 4,
                descripcion: "Climatización y Ventilación"
              },
              estado: "Activo"
            },
            {
              id: 10,
              nombre: "Plancha de Ropa a Vapor",
              descripcion: "Suela de cerámica, golpe de vapor vertical y sistema antigoteo.",
              cantidad: 30,
              categoria: {
                id: 3,
                descripcion: "Limpieza y Cuidado del Hogar"
              },
              estado: "Activo"
            }
          ];

        dispatch({ type: TYPES.READ_ALL_DATA, payload: data });
        setLoading(false);
    };
    
        

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
            res.data.categoria = res.data.categoria.id;
            setDetail(res.data);
            setArticuloCaracteristicas(res.data.caracteristicas);
            setLoading(false);
        });
    };

    const fetchDataCategorias = () => {
        let urlFetch = REACT_APP_API_URL+"categoria";
        api.get(urlFetch).then((res) => {
            var data = res.data.map(function (obj) {
                obj.text = obj.text || obj.descripcion;
                return obj;
            });
            setCategorias(data);
        });
    };

    const fetchDataCaracteristicas = () => {
        let urlFetch = REACT_APP_API_URL+"caracteristica";
        api.get(urlFetch).then((res) => {
            var data = res.data.map(function (obj) {
                obj.text = obj.text || obj.descripcion;
                return obj;
            });
            setCaracteristicas(data);
        });
    };

    const saveData = (data) => {
        setLoading(true);
        let endpoint = url;
        let categoria = {id: data.categoria}
        let newData = data;
        newData.categoria = categoria;
        delete newData.id;
        let options = {
            body: newData,
            headers: {"content-type":"application/json"}
        }
        api.post(endpoint, options).then((res) => {
            if(!res.err){
                dispatch({ type: TYPES.CREATE_DATA, payload: res.data });
                navigate('/admin/articulo/');
                setType("success");
                setMessage("The registry was updated correctly");
                setStatus(1);
            }else{

            }
            setLoading(false);
        })
    }

    const updateData = (data) => {
        setLoading(true);
        let endpoint = url+"/"+data.id;
        let categoria = {id: data.categoria}
        let newData = data;
        newData.categoria = categoria;
        delete newData.id;
        let options = {
            body: newData,
            headers: {"content-type":"application/json"}
        }
        api.put(endpoint, options).then((res) => {
            if(!res.err){
                setDetail(res.data);
                dispatch({ type: TYPES.UPDATE_DATA, payload: res.data });
                navigate('/admin/articulo');
                setType("success");
                setMessage("The registry was updated correctly");
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

    const addCaracteristica = (data) => {
        let exist = false;
        articuloCaracteristicas.map((el) => {
            if(el.description === data.caracteristica_text){
                exist = true;
                return;
            }
        });
        if(exist){
            setType("danger");
            setMessage("La caracteristica ya existe");
            setStatus(1);
            return;
        }else{
            let endpoint = REACT_APP_API_URL+"articuloCaracteristica";
            let articulo = {id: toUpdate}
            let caracteristica = {id: data.caracteristica}
            let newData = {
                ...data,
                articulo,
                caracteristica,
            }
            let options = {
                body: newData,
                headers: {"content-type":"application/json"}
            }
            api.post(endpoint, options).then((res) => {
                if(!res.err){
                    setArticuloCaracteristicas((articuloCaracteristicas) => {
                        return [...articuloCaracteristicas, res.data]
                    })
                    setType("success");
                    setMessage("La caracteristica ha sido guardada");
                    setStatus(1);
                }else{

                }
            })
        }
    }

    const deleteCaracteristica = (id) => {
        let endpoint = REACT_APP_API_URL+"articuloCaracteristica/"+id;
        let options = {
            body: "",
            headers: {"content-type":"application/json"}
        }
        api.del(endpoint, options).then((res) => {
            if(!res.err){
                let newData = articuloCaracteristicas.filter((el) => el.id !== id);
                setArticuloCaracteristicas(newData);
                setType("success");
                setMessage("La caracteristica ha sido eliminada");
                setStatus(1);
            }
        });
    }

    const data = { 
        db, detail, setToDetail, setToUpdate, updateData, saveData, deleteData, module, 
        setModule, setDetail, categorias, articuloCaracteristicas, addCaracteristica, 
        deleteCaracteristica, caracteristicas, verModalCaracteristica, setVerModalCaracteristica
    };

    return <ArticuloContext.Provider value={data}>{children}</ArticuloContext.Provider>;
}

export { ArticuloProvider };
export default ArticuloContext;
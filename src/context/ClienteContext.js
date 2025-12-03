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

const ClienteContext = createContext();

const ClienteProvider = ({ children }) => {
  const [toDetail, setToDetail] = useState();
  const [toUpdate, setToUpdate] = useState();
  const [detail, setDetail] = useState({});
  const [module, setModule] = useState();

  const [ciudades, setCiudades] = useState([]);
  const [tipoDocumentos, setTipoDocumentos] = useState([]);
  const [estadoClientes, setEstadoClientes] = useState([]);

  const [zonas, setZonas] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [listaPrecios, setListaPrecios] = useState([]);
  const [tipoClientes, setTipoClientes] = useState([]);

  const navigate = useNavigate();
  const { REACT_APP_API_URL } = process.env;

  const { setMessage, setStatus, setType } = useContext(NotificationContext);
  const { setLoading } = useContext(LoadingContext);

  const [state, dispatch] = useReducer(genericReducer, genericInitialState);
  const { db } = state;

  let api = helpHttp();
  let url = REACT_APP_API_URL + "cliente";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (toUpdate && toUpdate != 0) {
      fetchDataDetail();
    }
  }, [toUpdate]);

  useEffect(() => {
    if (module == "actualizar") {
      fetchDataZonas();
      fetchDataVendedores();
      fetchDataListaPrecios();
      fetchDataTipoClientes();
    }
    fetchDataCiudades();
    fetchDataTipoDocumentos();
    fetchDataEstadoClientes();
  }, [module]);

  const fetchData = () => {
    setLoading(true);
    api.get(url).then((res) => {
      if (!res.err) {
        dispatch({ type: TYPES.READ_ALL_DATA, payload: res.data });
      } else {
        dispatch({ type: TYPES.NO_DATA });
      }
      //setLoading(false);
    });
  };

  const fetchDataDetail = () => {
    setLoading(true);
    url = url + "/" + toUpdate;
    api.get(url).then((res) => {
      const detail = {
        ...res.data,
        ciudad: res.data?.ciudad?.id ?? null,
        tipoDocumento: res.data?.tipoDocumento?.id ?? null,
        clienteEstado: res.data?.clienteEstado?.id ?? null,
      };
      setDetail(detail);
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

  const fetchDataEstadoClientes = () => {
    let urlFetch = REACT_APP_API_URL + "clienteestado";
    api.get(urlFetch).then((res) => {
      var data = res.data.map(function (obj) {
        obj.text = obj.text || obj.descripcion;
        return obj;
      });
      setEstadoClientes(data);
      setLoading(false);
    });
  };

  const fetchDataZonas = () => {
    let urlFetch = REACT_APP_API_URL + "zona";
    api.get(urlFetch).then((res) => {
      var data = res.data.map(function (obj) {
        obj.text = obj.text || obj.descripcion;
        return obj;
      });
      setZonas(data);
    });
  };

  const fetchDataVendedores = () => {
    let urlFetch = REACT_APP_API_URL + "vendedor";
    api.get(urlFetch).then((res) => {
      var data = res.data.map(function (obj) {
        obj.text = obj.text || obj.descripcion;
        return obj;
      });
      setVendedores(data);
    });
  };

  const fetchDataListaPrecios = () => {
    let urlFetch = REACT_APP_API_URL + "listaprecio";
    api.get(urlFetch).then((res) => {
      var data = res.data.map(function (obj) {
        obj.text = obj.text || obj.descripcion;
        return obj;
      });
      setListaPrecios(data);
    });
  };

  const fetchDataTipoClientes = () => {
    let urlFetch = REACT_APP_API_URL + "tipocliente";
    api.get(urlFetch).then((res) => {
      var data = res.data.map(function (obj) {
        obj.text = obj.text || obj.descripcion;
        return obj;
      });
      setTipoClientes(data);
    });
  };

  const saveData = (data) => {
    setLoading(true);
    let endpoint = url;

    const newData = {
      ...data,
      ciudad: { id: data.ciudad },
      tipoDocumento: { id: data.tipoDocumento },
      clienteEstado: { id: data.clienteEstado }
    };

    let options = {
      body: newData,
      headers: { "content-type": "application/json" },
    };

    api.post(endpoint, options).then((res) => {
      if (!res.err) {
        dispatch({ type: TYPES.CREATE_DATA, payload: res.data });
        navigate("/admin/cliente/");
        setType("success");
        setMessage("El Cliente se guardo correctamente");
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
      ciudad: { id: data.ciudad },
      tipoDocumento: { id: data.tipoDocumento },
      clienteEstado: { id: data.clienteEstado }
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
        navigate("/admin/cliente");
        setType("success");
        setMessage("El Cliente se actualizo correctamente");
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
        setMessage("El Cliente se elimino correctamente");
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
    ciudades,
    tipoDocumentos,
    estadoClientes,
    zonas,
    vendedores,
    listaPrecios,
    tipoClientes,
  };

  return (
    <ClienteContext.Provider value={data}>{children}</ClienteContext.Provider>
  );
};

export { ClienteProvider };
export default ClienteContext;

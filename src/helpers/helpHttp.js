import authService from "services/auth";

export const helpHttp = () => {

    const customFecth = (endpoint, options) => {

        if(authService.getCurrentUser()){
            authService.checkTokenExpiry();
        }

        const deaultHeader = {
            accept: "application/json"
        }

        const authorizationHeader = {
            Authorization : "Bearer " + authService.getCurrentUser()
        }

        const controller = new AbortController();
        options.signal = controller.signal;

        options.method = options.method || "GET";
        options.headers = options.headers ? {...deaultHeader, ...options.headers} : deaultHeader;

        options.headers = {...options.headers, ...authorizationHeader};

        options.body = JSON.stringify(options.body) || false;
        if(!options.body) delete options.body;

        options.maxContentLength = Infinity
        options.maxBodyLength = Infinity

        setTimeout(() => controller.abort(), 30000);

        /*return fetch(endpoint, options)
        .then((res) => 
            res.ok ? res.json()
            :Promise.reject({
                err: true,
                status: res.status || "00",
                statusText: res.statusText || "Ocurrio un Error"
            })
        )
        .catch(err=>err)*/

        return fetch(endpoint, options)
        .then((res) => {
            if (res.ok) {
                return res.json(); // Parsear la respuesta JSON
            } else {
                return res.json().then((errorData) => {
                    // Rechazar la promesa con el objeto de error que incluye el mensaje del servicio.
                    return Promise.reject({
                        err: true,
                        status: res.status || "00",
                        statusText: res.statusText || "Ocurrió un Error",
                        message: errorData.msg // Acceder al mensaje desde el JSON de error.
                    });
                });
            }
        })
        .catch((err) => {
            // Manejar la excepción y devolver el objeto de error.
            return {
                err: true,
                message: err || "Ocurrió un error desconocido",
            };
        });


    }
    const get = (url, options = {}) => {
        return customFecth(url, options);
    }
    const post = (url, options = {}) => {
        options.method = "POST";
        return customFecth(url, options);
    }
    const put = (url, options = {}) => {
        options.method = "PUT";
        return customFecth(url, options);
    }
    const del = (url, options = {}) => {
        options.method = "DELETE";
        return customFecth(url, options);
    }
    return {
        get, post, put, del
    }
}
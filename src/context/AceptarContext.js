// import React, { createContext, useState, useEffect, useContext } from "react";
// import ClienteContext from "./ClienteContext";
// import NotificationContext from "./NotificationContext";

// const AceptarContext = createContext();

// export const AceptarProvider = ({ children }) => {
//   const [clientesPendientes, setClientesPendientes] = useState(() => {
//     const stored = localStorage.getItem("clientesPendientes");
//     return stored ? JSON.parse(stored) : [];
//   });

//   const { addCliente } = useContext(ClienteContext) || {};
//   const { notificaciones = [], setNotificaciones, removeNotification } =
//     useContext(NotificationContext) || {};

//   // 🔄 Sincronizar con localStorage
//   useEffect(() => {
//     localStorage.setItem("clientesPendientes", JSON.stringify(clientesPendientes));
//   }, [clientesPendientes]);

//   // ➕ Agregar nuevo pendiente
//   const addClientePendiente = (cliente) => {
//     const updated = [...clientesPendientes, cliente];
//     setClientesPendientes(updated);
//     localStorage.setItem("clientesPendientes", JSON.stringify(updated));
//     console.log("🟢 Cliente agregado a pendientes:", cliente);
//   };

//   // ✅ Aceptar cliente → mover a tabla principal y quitar notificación
//   const aceptarCliente = (id) => {
//     const cliente = clientesPendientes.find((c) => c.id === id);
//     if (cliente && addCliente) {
//       addCliente(cliente);
//     }

//     // 1️⃣ Eliminar cliente pendiente
//     const updatedPendientes = clientesPendientes.filter((c) => c.id !== id);
//     setClientesPendientes(updatedPendientes);
//     localStorage.setItem("clientesPendientes", JSON.stringify(updatedPendientes));

//     // 2️⃣ Eliminar notificación correspondiente
//     const updatedNotificaciones = notificaciones.filter((n) => n.id !== id);
//     setNotificaciones(updatedNotificaciones);
//     localStorage.setItem("notificaciones", JSON.stringify(updatedNotificaciones));

//     console.log("✅ Cliente aceptado y movido a tabla principal:", cliente);
//   };

//   // ❌ Rechazar cliente → eliminar y quitar notificación
//   const rechazarCliente = (id) => {
//     const updatedPendientes = clientesPendientes.filter((c) => c.id !== id);
//     setClientesPendientes(updatedPendientes);
//     localStorage.setItem("clientesPendientes", JSON.stringify(updatedPendientes));

//     const updatedNotificaciones = notificaciones.filter((n) => n.id !== id);
//     setNotificaciones(updatedNotificaciones);
//     localStorage.setItem("notificaciones", JSON.stringify(updatedNotificaciones));

//     console.log("❌ Cliente rechazado y eliminado del contexto:", id);
//   };

//   return (
//     <AceptarContext.Provider
//       value={{
//         clientesPendientes,
//         addClientePendiente,
//         aceptarCliente,
//         rechazarCliente,
//       }}
//     >
//       {children}
//     </AceptarContext.Provider>
//   );
// };

// export default AceptarContext;
// src/context/AceptarContext.js
// src/context/AceptarContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import ClienteContext from "./ClienteContext";
import NotificationContext from "./NotificationContext";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/";

const AceptarContext = createContext();

export const AceptarProvider = ({ children }) => {
  const [clientesPendientes, setClientesPendientes] = useState(() => {
    const stored = localStorage.getItem("clientesPendientes");
    return stored ? JSON.parse(stored) : [];
  });

  const { addCliente } = useContext(ClienteContext) || {};
  const notificationCtx = useContext(NotificationContext) || {};
  const {
    notificaciones = [],
    addNotification,
    removeNotification,
    setNotificaciones,
  } = notificationCtx;

  // 🧹 Sincroniza y limpia pendientes si el backend no tiene registros
  useEffect(() => {
    const limpiarPendientes = async () => {
      try {
        const res = await fetch(`${API_URL}cliente/pendientes`);
        const data = await res.json();

        if (res.ok) {
          const pendientes = data.data || [];

          // 🔄 Evita duplicados si vienen desde backend
          const idsUnicos = new Set();
          const filtrados = pendientes.filter((c) => {
            if (idsUnicos.has(c.id)) return false;
            idsUnicos.add(c.id);
            return true;
          });

          setClientesPendientes(filtrados);
          localStorage.setItem("clientesPendientes", JSON.stringify(filtrados));

          if (filtrados.length === 0) {
            console.log("🧹 No hay clientes pendientes, limpiando almacenamiento local...");
            localStorage.removeItem("clientesPendientes");
            if (setNotificaciones) setNotificaciones([]);
          }
        }
      } catch (err) {
        console.error("❌ Error verificando clientes pendientes:", err);
      }
    };

    limpiarPendientes();
  }, []);

  // ➕ Agregar cliente pendiente (evita duplicados)
  const addClientePendiente = (cliente) => {
    setClientesPendientes((prev) => {
      const existe = prev.some((c) => c.id === cliente.id);
      if (existe) {
        console.warn("⚠️ Cliente ya existente en pendientes:", cliente.nombre);
        return prev;
      }

      const updated = [...prev, cliente];
      localStorage.setItem("clientesPendientes", JSON.stringify(updated));

      console.log("🟢 Cliente agregado a pendientes:", cliente);

      // 🔔 Agregar notificación solo si no existe
      if (addNotification && !notificaciones.some((n) => n.id === cliente.id)) {
        addNotification({
          id: cliente.id,
          mensaje: `Nuevo registro: ${cliente.nombre}`,
          estado: cliente.cliente_estado?.descripcion || "En proceso",
          fecha: new Date().toISOString(),
        });
      }

      return updated;
    });
  };

  // 🔍 Revisar cliente (cambia a "En revisión", no se elimina)
  const revisarCliente = async (id) => {
  const cliente = clientesPendientes.find((c) => c.id === id);
  if (!cliente) return;

  Swal.fire({
    title: "¿Revisar cliente?",
    text: "El estado cambiará a 'En revisión'.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, revisar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#58AB01",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_URL}cliente/${id}/estado?nuevoEstado=En revisión`, {
          method: "PUT",
        });

        if (res.ok) {
          setClientesPendientes((prev) =>
            prev.map((c) =>
              c.id === id
                ? { ...c, cliente_estado: { ...c.cliente_estado, descripcion: "En revisión" } }
                : c
            )
          );

          // ⚠️ NO eliminar notificación
          console.log(`🟡 Cliente ${id} en revisión, notificación conservada`);

          Swal.fire("En revisión", "El cliente está en revisión.", "info");
        }
      } catch (error) {
        console.error("Error al revisar cliente:", error);
        Swal.fire("Error", "No se pudo actualizar el estado.", "error");
      }
    }
  });
};

  // ✅ Aprobar cliente
  const aprobarCliente = async (id, dataExtra) => {
  const cliente = clientesPendientes.find((c) => c.id === id);
  if (!cliente) return;

  Swal.fire({
    title: "¿Aprobar cliente?",
    text: "Confirma que deseas aceptar al cliente.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, aprobar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#58AB01",
  }).then(async (result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Procesando...",
        text: "Por favor espera un momento",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const res = await fetch(`${API_URL}cliente/${id}/estado?nuevoEstado=Aceptado`, {
          method: "PUT",
        });

        if (res.ok) {
          setClientesPendientes((prev) => prev.filter((c) => c.id !== id));

          // ✅ Eliminar notificación solo aquí
          if (removeNotification) removeNotification(id, "Aceptado");

          Swal.fire("✅ Aprobado", "El cliente fue aceptado correctamente.", "success");
        } else {
          Swal.fire("Error", "No se pudo aprobar el cliente.", "error");
        }
      } catch (error) {
        console.error("Error al aprobar cliente:", error);
        Swal.fire("Error", "Fallo de conexión al servidor.", "error");
      }
    }
  });
};


  // ❌ Rechazar cliente
  const rechazarCliente = async (id) => {
  const cliente = clientesPendientes.find((c) => c.id === id);
  if (!cliente) return;

  Swal.fire({
    title: "¿Rechazar cliente?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, rechazar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
  }).then(async (result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Rechazando...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        const res = await fetch(`${API_URL}cliente/${id}/estado?nuevoEstado=Rechazado`, {
          method: "PUT",
        });

        if (res.ok) {
          setClientesPendientes((prev) => prev.filter((c) => c.id !== id));

          // ✅ Eliminar notificación solo si se rechaza
          if (removeNotification) removeNotification(id, "Rechazado");

          Swal.fire("Rechazado", "El cliente fue rechazado correctamente.", "success");
        } else {
          Swal.fire("Error", "No se pudo rechazar el cliente.", "error");
        }
      } catch (error) {
        console.error("Error al rechazar cliente:", error);
        Swal.fire("Error", "Fallo de conexión al servidor.", "error");
      }
    }
  });
};

  return (
    <AceptarContext.Provider
      value={{
        clientesPendientes,
        addClientePendiente,
        revisarCliente,
        aprobarCliente,
        rechazarCliente,
      }}
    >
      {children}
    </AceptarContext.Provider>
  );
};

export default AceptarContext;

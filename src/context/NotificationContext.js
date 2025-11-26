// src/context/NotificationContext.js
import React, { createContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/";
  const [notificaciones, setNotificaciones] = useState([]);
  const [status, setStatus] = useState(0);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [total, setTotal] = useState(0);

  // 🕒 Cargar notificaciones desde el backend (clientes en proceso o revisión)
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}cliente/pendientes`);
      const data = await res.json();

      if (res.ok) {
        const clientesPendientes = data.data || [];

        // 🔍 Convertimos los clientes a formato de notificación
        const nuevasNotificaciones = clientesPendientes.map((cliente) => ({
          id: cliente.id,
          mensaje: `Nuevo registro: ${cliente.nombre}`,
          estado: cliente.cliente_estado?.descripcion || "En proceso",
        }));

        // 🧼 Eliminar duplicados por ID (más robusto)
        const idsUnicos = new Set();
        const filtradas = nuevasNotificaciones.filter((n) => {
          if (idsUnicos.has(n.id)) return false;
          idsUnicos.add(n.id);
          return true;
        });

        setNotificaciones(filtradas);
        setTotal(filtradas.length);
      } else {
        console.warn("⚠️ Error al obtener notificaciones desde el backend.");
        setNotificaciones([]);
        setTotal(0);
      }
    } catch (error) {
      console.error("❌ Error al cargar notificaciones:", error);
      setNotificaciones([]);
      setTotal(0);
    }
  };

  // 🔁 Actualiza las notificaciones cada 10 segundos
  useEffect(() => {
    //fetchNotifications();
    //const interval = setInterval(fetchNotifications, 10000);
    //return () => clearInterval(interval);
  }, []);

  // ➕ Agregar notificación manual (desde formulario, sin duplicar)
  const addNotification = (nueva) => {
    const notificacion = {
      id: nueva.id || Date.now(),
      mensaje: nueva.mensaje || "Nueva notificación",
      estado: nueva.estado || "En proceso",
      fecha: nueva.fecha || new Date().toISOString(),
    };

    setNotificaciones((prev) => {
      const existe = prev.some((n) => n.id === notificacion.id);
      if (existe) return prev;
      return [...prev, notificacion];
    });

    console.log("🔔 Nueva notificación agregada:", notificacion);
    setTotal((prev) => prev + 1);
  };

  // ❌ Eliminar notificación solo si se acepta o rechaza
  const removeNotification = (id, estado) => {
    if (estado === "Aceptado" || estado === "Rechazado") {
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      setTotal((prev) => Math.max(prev - 1, 0));
      console.log(`🧹 Notificación eliminada ID: ${id} (${estado})`);
    } else {
      console.log(
        `🚫 Notificación ID: ${id} no eliminada, estado actual: ${estado}`
      );
    }
  };

  // 🧽 Limpiar todas las notificaciones
  const clearNotifications = () => {
    setNotificaciones([]);
    setTotal(0);
    console.log("🧼 Todas las notificaciones limpiadas.");
  };

  return (
    <NotificationContext.Provider
      value={{
        notificaciones,
        setNotificaciones,
        addNotification,
        removeNotification,
        clearNotifications,
        total,
        status,
        setStatus,
        type,
        setType,
        message,
        setMessage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

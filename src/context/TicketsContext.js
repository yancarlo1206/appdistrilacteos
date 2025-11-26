// src/context/TicketsContext.js

import { createContext, useState } from "react";
import { useEffect } from "react";

const TicketsContext = createContext();

export const TicketsProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [estadoTickets, setEstadoTickets] = useState([]);
  const [prioridadTickets, setPrioridadTickets] = useState([]);
  const [tipoTickets, setTipoTickets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ticketsRes = await fetch(`${process.env.REACT_APP_API_URL}ticket`);
        const estadoRes = await fetch(`${process.env.REACT_APP_API_URL}estadoTicket`);
        const prioridadRes = await fetch(`${process.env.REACT_APP_API_URL}prioridadTicket`);
        const tipoRes = await fetch(`${process.env.REACT_APP_API_URL}tipoTicket`);

        const ticketsData = await ticketsRes.json();
        const estadoData = await estadoRes.json();
        const prioridadData = await prioridadRes.json();
        const tipoData = await tipoRes.json();

        setTickets(ticketsData.data);
        setEstadoTickets(estadoData.data);
        setPrioridadTickets(prioridadData.data);
        setTipoTickets(tipoData.data);
      } catch (err) {
        console.error("Error al cargar datos de tickets:", err);
      }
    };
    fetchData();
  }, []);

  const deleteData = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}ticket/${id}`, {
        method: "DELETE",
      });
      setTickets(tickets.filter((ticket) => ticket.id !== id));
    } catch (err) {
      console.error("Error al eliminar el ticket:", err);
    }
  };

  const saveData = async (ticket) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticket),
      });

      const newTicket = await res.json();
      setTickets((prev) => [...prev, newTicket]);
    } catch (err) {
      console.error("Error al guardar el ticket:", err);
    }
  };

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        estadoTickets,
        prioridadTickets,
        tipoTickets,
        deleteData,
        saveData,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};

export default TicketsContext;

import Index from "views/Index.js";
import Login from "views/pages/login/Login.jsx";
import Cliente from "views/pages/cliente/Index";
import Ticket from "views/pages/ticket/Index";
import Aceptar from "views/pages/aceptar/index.js";
import Registro from "views/pages/registro/Index";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-danger",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/cliente",
    name: "Cliente",
    icon: "ni ni-user-run text-primary",
    component: <Cliente />,
    layout: "/admin",
  },
  {
    path: "/ticket",
    name: "Ticket",
    icon: "ni ni-user-run text-primary",
    component: <Ticket />,
    layout: "/admin",
  },
  {
    path: "/registro/*",
    name: "Registro Cliente",
    icon: "ni ni-single-02 text-yellow",
    component: <Registro />,
    layout: "/auth",
    invisible: true
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
    invisible: true
  },
];

export default routes;

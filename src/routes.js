/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Login from "views/pages/login/Login.jsx";
import Cliente from "views/pages/cliente/Index";
import Tickets from "views/pages/tickets/Index";
import FormularioCliente from "views/pages/FormularioCliente.js";
import Aceptar from "views/pages/aceptar/index.js";

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
    path: "/tickets",
    name: "Tickets",
    icon: "ni ni-user-run text-primary",
    component: <Tickets />,
    layout: "/admin",
  },
  {
    path: "/registro-cliente", // ← Debe coincidir con el NavLink
    name: "Registro Cliente",
    icon: "ni ni-single-02 text-yellow",
    component: <FormularioCliente />,
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
  {
    path: "/aceptar",
    name: "Aceptar Clientes",
    icon: "ni ni-user-run text-primary",
    component: <Aceptar />,
    layout: "/admin",
  },
];
export default routes;

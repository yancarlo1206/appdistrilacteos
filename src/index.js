
/*!
=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim
* Licensed under MIT
=========================================================
*/

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

// ✅ Importa tus contextos globales
import { NotificationProvider } from "context/NotificationContext";
import { AuthProvider } from "context/AuthProvider";


import { AceptarProvider } from "context/AceptarContext";
import { ClienteProvider } from "context/ClienteContext"; 
import { LoadingProvider } from "context/LoadingContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <NotificationProvider>
    <AuthProvider>
    <AceptarProvider>
      <LoadingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </AceptarProvider>
    </AuthProvider>
  </NotificationProvider>
);

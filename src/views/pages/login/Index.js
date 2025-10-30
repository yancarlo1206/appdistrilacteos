import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Login";

import { LoginProvider } from "context/LoginContext";

const Index = () => {

    return(
        <>
        <LoginProvider>
        <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </LoginProvider>
        </>
    );
}

export default Index;
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import List from "./List";
import Form from "./Form";

import { ProveedorProvider } from "context/ProveedorContext";

const Index = () => {

    return(
        <>
        <ProveedorProvider>
        <Routes>
            <Route exact path="/" element={<List />} />
            <Route exact path="/detail/:id" element={<Form />} />
            <Route exact path="/add" element={<Form />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ProveedorProvider>
        </>
    );
}

export default Index;
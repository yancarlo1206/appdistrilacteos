import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import List from "./List";
import Form from "./Form";

import { CaracteristicaProvider } from "context/CaracteristicaContext";

const Index = () => {

    return(
        <>
        <CaracteristicaProvider>
        <Routes>
            <Route exact path="/" element={<List />} />
            <Route exact path="/detail/:id" element={<Form />} />
            <Route exact path="/add" element={<Form />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </CaracteristicaProvider>
        </>
    );
}

export default Index;
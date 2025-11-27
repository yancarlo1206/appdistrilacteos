import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Form from "./Form";

import { RegistroProvider } from "context/RegistroContext";

const Index = () => {

    return (
        <>
            <RegistroProvider>
                <Routes>
                    <Route exact path="/" element={<Form />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </RegistroProvider>
        </>
    );
}

export default Index;
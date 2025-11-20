import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import List from "./List";
import Form from "./Form";
import { AceptarProvider } from "context/AceptarContext";

const Index = () => {
  return (
    <AceptarProvider>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/detail/:id" element={<Form />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AceptarProvider>
  );
};

export default Index;

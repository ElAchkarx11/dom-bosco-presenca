// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Telas/Home';
import Login from './Telas/Login';
import Registro from './Telas/Registro';
import CadastrarClientes from './Telas/CadastrarClientes';
import CadastrarEntradas from './Telas/CadastrarEntradas';
import Relatorios from './Telas/Relatorios';
import RelatorioDia from './Telas/RelatorioDia';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/> }/>
        <Route path="/Home" element={<Home/>}/>
        <Route path="/Registro" element={<Registro/>}/>
        <Route path="/CadastrarClientes" element={<CadastrarClientes/>}/>
        <Route path="/CadastrarEntradas" element={<CadastrarEntradas/>}/>
        <Route path="/Relatorios" element={<Relatorios/>}/>
        <Route path="/RelatorioDia/:dia" element={<RelatorioDia/>}/>
      </Routes>
    </Router>
  );
}

export default App;

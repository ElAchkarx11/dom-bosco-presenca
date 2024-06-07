// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Telas/Home/Home';
import Login from './Telas/Login/Login';
import Registro from './Telas/RegistroEntradas/Registro';
import CadastrarClientes from './Telas/CadastroClientes/CadastrarClientes';
import CadastrarEntradas from './Telas/CadastroEntradas/CadastrarEntradas';
import Relatorios from './Telas/Relatorios/Relatorios';
import RelatorioDia from './Telas/Relatorios/RelatorioDia';

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

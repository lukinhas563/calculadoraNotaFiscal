import React from 'react';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard';
import Sobre from './components/Sobre';
import Duvidas from './components/Duvidas';
import { Routes, Route } from 'react-router-dom';
import './App.css';

export default function App() {



  return (
    <>
      <Menu />
      <Routes>
        <Route path='/' Component={Dashboard} />
        <Route path='/sobre' Component={Sobre} />
        <Route path='/duvidas' Component={Duvidas} />
      </Routes>
    </>
  );
}

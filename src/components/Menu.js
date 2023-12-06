import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

export default function Menu(props) {

    const [menuAtivo, setMenuAtivo] = useState('Inicio');

    const ativaMenu = (menu) => {
        setMenuAtivo(menu);
    }

    return (
        <nav className='menu'>
            <Link to='/' className={`link ${menuAtivo === "Inicio" ? "ativo" : ""}`} onClick={() => ativaMenu('Inicio')}>Inicio</Link>
            <Link to='/sobre' className={`link ${menuAtivo === "Sobre" ? "ativo" : ""}`} onClick={() => ativaMenu('Sobre')}>Sobre</Link>
            <Link to='/duvidas' className={`link ${menuAtivo === "Dúvidas" ? "ativo" : ""}`} onClick={() => ativaMenu('Dúvidas')}>Dúvidas</Link>
        </nav>

    )
}
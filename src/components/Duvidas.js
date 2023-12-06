import React, { useState } from "react";
import ICMS from './Duvidas/Impostos/ICMS';
import ST from './Duvidas/Impostos/ST';
import IRPJ from './Duvidas/Impostos/IRPJ';
import QuemSomos from './Duvidas/Impostos/QuemSomos';
import IPI from "./Duvidas/Impostos/IPI";
import NCM from "./Duvidas/Impostos/NCM";
import Seguranca from "./Duvidas/Sobre-NFECalc/Seguranca";
import Privacidade from "./Duvidas/Sobre-NFECalc/Privacidade";
import Como from "./Duvidas/Gerais/Como";
import Danfe from "./Duvidas/Gerais/Danfe";
import Armazenamento from "./Duvidas/Gerais/Armazenamento";
import './Duvidas.css';

export default function Duvidas() {

    const [artigo, setArtigo] = useState(<ICMS />);

    const mostraMenu = (e) => {

        const menuExpansivo = e.target.nextSibling;

        if (menuExpansivo.classList[1] !== 'removerMenu') {
            menuExpansivo.classList.add('removerMenu')
        } else {
            menuExpansivo.classList.remove('removerMenu')
        }

    }

    const mostraPagina = (artigo) => {

        if (artigo === 'QuemSomos') { setArtigo(<QuemSomos />) }
        if (artigo === 'ICMS') { setArtigo(<ICMS />) }
        if (artigo === 'ST') { setArtigo(<ST />) }
        if (artigo === 'IRPJ') { setArtigo(<IRPJ />) }
        if (artigo === 'IPI') { setArtigo(<IPI />) }
        if (artigo === 'NCM') { setArtigo(<NCM />) }
        if (artigo === 'Seguranca') { setArtigo(<Seguranca />) }
        if (artigo === 'Privacidade') { setArtigo(<Privacidade />) }
        if (artigo === 'COMO') { setArtigo(<Como />) }
        if (artigo === 'DANFE') { setArtigo(<Danfe />) }
        if (artigo === 'Armazenamento') { setArtigo(<Armazenamento />) }

    }

    return (
        <section>
            <header className="container-titulo">
                <h2>Dúvidas</h2>
            </header>
            <div className="container-menu-duvidas">
                <aside className="container-menu">
                    <button className="btn-primeiro" onClick={(e) => mostraMenu(e)}>Gerais</button>
                    <ul className="container-menu-dois removerMenu">
                        <li onClick={() => mostraPagina('COMO')}>Como são calculadas as NF-E</li>
                        <li onClick={() => mostraPagina('DANFE')}>O que é DANFE</li>
                        <li onClick={() => mostraPagina('Armazenamento')}>Armazenamento das informações</li>
                    </ul>
                    <button className="btn-primeiro" onClick={(e) => mostraMenu(e)}>Impostos</button>
                    <ul className="container-menu-dois removerMenu">
                        <li onClick={() => mostraPagina('ICMS')}>ICMS - Imposto sobre Circulação de Mercadorias</li>
                        <li onClick={() => mostraPagina('ST')}>ST - Substituição Tributária</li>
                        <li onClick={() => mostraPagina('IRPJ')}>IRPJ - Imposto de Renda das Pessoas Jurídicas</li>
                        <li onClick={() => mostraPagina('IPI')}>IPI - Imposto sobre Produtos Industrializados</li>
                        <li onClick={() => mostraPagina('NCM')}>NCM - Nomenclatura Comum do Mercosul</li>
                    </ul>
                    <button className="btn-primeiro" onClick={(e) => mostraMenu(e)}> Sobre NFECalc</button>
                    <ul className="container-menu-dois removerMenu">
                        <li onClick={() => mostraPagina('QuemSomos')}>Quem somos</li>
                        <li onClick={() => mostraPagina('Seguranca')}>Segurança</li>
                        <li onClick={() => mostraPagina('Privacidade')}>Privacidade</li>
                    </ul>
                </aside>
                <section className="container-duvidas">
                    {artigo}
                </section>
            </div>
        </section>
    )
}
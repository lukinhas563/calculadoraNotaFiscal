import React, { useState, useEffect, useRef } from "react";
import Leitor from './Leitor';
import Tabela from "./Tabela";
import Calculo from "./Calculo";
import Erro from "./Erro";
import Carregamento from "./Carregando";
import './Dashboard.css'

export default function Dashboard() {

    const [nfe, setNfe] = useState([]);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState('');
    const fileInputRef = useRef(null);

    const getNFE = (nfe) => {

        const nfeCalculado = Calculo(nfe);

        setNfe(nfeCalculado);
        mostraCarregamento(1);
    }

    const carregar = () => {
        fileInputRef.current.click();
    }

    useEffect(() => {

        const getNfe = localStorage.getItem('nfe');

        if (getNfe !== null) {
            const parseNfe = JSON.parse(getNfe);
            setNfe(parseNfe);
        }

    }, []);

    const mostraErro = (status) => {
        if (status === 1) {
            setErro('');
        } else {
            setErro(<Erro mostraErro={mostraErro} />)
        }
    }

    const mostraCarregamento = (status) => {
        if (status === 1) {
            setCarregando('');
        } else {
            setCarregando(<Carregamento />)
        }
    }

    const onChangeHandler = (e) => {
        mostraCarregamento(2);

        new Leitor(e, getNFE, mostraErro, mostraCarregamento);

    }

    const excluir = (chave) => {
        const novoNfe = [...nfe];
        novoNfe.splice(chave, 1)
        setNfe(novoNfe);
        const textNovoNfe = JSON.stringify(novoNfe);
        localStorage.setItem('nfe', textNovoNfe);
    }

    return (
        <main className="dashboard">
            {erro}
            {carregando}
            <header className="container-titulo">
                <h1>DashBoard</h1>
            </header>

            <section className="container">
                <form className="formulario">
                    <label className="label">
                        <input type="file" name="nfe" onChange={(e) => onChangeHandler(e)} multiple ref={fileInputRef} />
                        <img src='/uploadFile.svg' alt="Três arquivos alinhados um do lado do outro com uma nuvem no meio" className="icone-arquivo" draggable='false' />
                        <h3>Selecione um arquivo para calcular</h3>
                        <p>Somente arquivos XML são permitidos</p>
                        <button className="bnt-carregar" type="button" onClick={() => carregar()} >Carregar</button>
                    </label>
                </form>
                <div>
                    <Tabela nfe={nfe} excluir={excluir} />
                </div>
            </section>
            <footer className="cabecalho">Feito com carinho por: <a href="/sobre">Equipe NFECalc</a></footer>
        </main>
    )
}
import React from "react";
import './Erro.css'

export default function Erro(props) {


    return (
        <div className="erro">
            <div className="container-erro">
                <div className="container-erro-btn"><button onClick={() => props.mostraErro(1)}>X</button></div>
                <div className="container-erro-msg">
                    <img src="/MENSAGEM-erro.png" alt="Simbolo de erro" />
                    <h2>Máximo de arquivos excedido</h2>
                    <p>Máximo de 5 arquivos por envio.</p>
                </div>

            </div>
        </div>
    )
}
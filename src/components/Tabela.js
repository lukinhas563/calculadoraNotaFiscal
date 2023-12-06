import React from "react";
import { BsFiletypeXml, BsFillXCircleFill, BsList, BsClockFill } from "react-icons/bs"; // Icone arquivo XML
import './Tabela.css';

export default class Tabela extends React.Component {
    constructor(props) {
        super(props);

        this.verde = { color: '#06D177' };
        this.vermelho = { color: '#FF4040' };

    }

    retCor = (c) => {

        if (c === "Autorizado") {
            return this.verde
        } else {
            return this.vermelho
        }
    }


    mostraProdutos = (e) => {

        const produtos = e.currentTarget.lastChild;

        if (produtos.classList[1] === undefined) {
            produtos.classList.add('remover');
        } else {
            produtos.classList.remove('remover');
        }

    }

    mapProdutos = (produtos) => {
        return produtos.map(produto => (
            <div key={produto.nome} className="produtos-lista-linha"><p>{this.truncarString(produto.nome, 15)}</p> <p className="produtos-lista-linha-ncm">{produto.ncm}</p> <p>{produto.cfop}</p> <p>{produto.qtd}</p> <p className="produtos-lista-linha-unidade">{produto.unidade}</p> <p>R$ {Number(produto.valorUnit).toFixed(2)}</p> <p>R$ {Number(produto.valorTotal).toFixed(2)}</p></div>
        ));
    }

    truncarString = (string, valMax) => {
        if (string.length > valMax) {
            return string.slice(0, valMax) + "...";
        }

        return string;
    }

    calculaImpostos(produtos, imposto) {

        if (imposto === 1) {

            const icms = [];
            let total = 0;

            for (const produto of produtos) {
                icms.push(produto.icms);
            }

            for (const valor of icms) {
                total += valor;
            }

            return total.toFixed(2);

        } else if (imposto === 2) {

            const cofins = [];
            let total = 0;

            for (const produto of produtos) {
                cofins.push(produto.cofins);
            }

            for (const valor of cofins) {
                total += valor;
            }

            return total.toFixed(2);

        } else if (imposto === 3) {

            const pis = [];
            let total = 0;

            for (const produto of produtos) {
                pis.push(produto.pis);
            }

            for (const valor of pis) {
                total += valor;
            }

            return total.toFixed(2);

        } else if (imposto === 4) {

            const bc = [];
            let total = 0;

            for (const produto of produtos) {
                bc.push(Number(produto.valorTotal));
            }

            for (const valor of bc) {
                total += valor;

            }

            return total.toFixed(2);

        }

    }

    retornaAlq(produtos, imposto) {

        if (imposto === 1) {

            const alqArray = [];
            let total = 0;
            let media = 0;

            for (const produto of produtos) {

                const aliquota = Number(produto.icmsAlq);
                alqArray.push(aliquota);

            }

            for (const aliquota of alqArray) {

                total += aliquota;

            }

            media = total / alqArray.length;

            return media;

        } else if (imposto === 2) {

            const alqArray = [];
            let total = 0;
            let media = 0;

            for (const produto of produtos) {

                const aliquota = Number(produto.cofinsAlq);
                alqArray.push(aliquota);

            }

            for (const aliquota of alqArray) {

                total += aliquota;

            }

            media = total / alqArray.length;

            return media.toFixed(2);

        } else if (imposto === 3) {

            const alqArray = [];
            let total = 0;
            let media = 0;

            for (const produto of produtos) {

                const aliquota = Number(produto.pis);
                alqArray.push(aliquota);

            }

            for (const aliquota of alqArray) {

                total += aliquota;

            }

            media = total / alqArray.length;

            return media.toFixed(2);

        }
    }


    // Começo do movimento
    dragstart(evento) {
        //console.log('LINHA: Comecei a mover');
        evento.currentTarget.classList.add('movendo');
    }

    dragend(evento) {
        // console.log('LINHA: Soltei');
        evento.currentTarget.classList.remove('movendo');
    }

    // Fim do movimento
    dragover(evento) {
        //console.log('LISTA: Passou por cima da lista');

        // Obtém o elemento sendo movido
        const itemMovido = document.querySelector('.movendo');

        // Obtém o elemento atual
        const itemAtual = evento.currentTarget;

        // Obtem o elemento pai(tabela)
        const tabela = document.querySelector('.tabela-ul');

        // Verifica se o próximo elemento é nulo
        if (itemAtual.nextSibling) {
            tabela.insertBefore(itemMovido, itemAtual);
        } else {
            tabela.appendChild(itemMovido);
        }

    }


    notas = () => {

        if (this.props.nfe.length >= 1) {

            return this.props.nfe.map((nota, index) => (
                < li key={index} id={index} className="tabela-hover" draggable='true' onDragStart={(e) => this.dragstart(e)} onDragEnd={(e) => this.dragend(e)} onDragOver={(e) => this.dragover(e)}>
                    <div className="tabela-linha" onClick={(e) => this.mostraProdutos(e)}>
                        <div className="tabela-linha-img"><div className="tabela-linha-imgContainer"><BsFiletypeXml className="icone-arquivo" /></div></div>
                        <div key={nota[0].numero} className="tabela-linha-numero">{nota[0].numero}</div>
                        <div key={nota[1].nomeEmit} className="tabela-linha-emitente">{nota[1].nomeEmit}</div>
                        <div key={nota[1].cnpjEmit} className="tabela-linha-cnpj">{nota[1].cnpjEmit}</div>
                        <div key={nota[0].data} className="tabela-linha-data"><BsClockFill className="icone-relogio" />{nota[0].data}</div>
                        <div key={nota[0].total}>R$ {nota[0].total}</div>
                        <div key={nota[0].status} className="tabela-linha-status" style={this.retCor(nota[0].status)}>{nota[0].status}</div>
                        <div className="tabela.linha-excluir"><button className="btn-excluir" onClick={(e) => { e.stopPropagation(); this.props.excluir(index) }}><BsFillXCircleFill className="icone-excluir" /></button></div>
                        <div><BsList className="icone-mover" /></div>
                        <div className="produtos remover">

                            <div className="produto-sessao">
                                <div className="produto-sessao-infos">
                                    <div className="produto-sessao-dois">
                                        <p className="chave"><b>Chave de acesso</b><br /> {nota[0].chave}</p>
                                        <p className="numero"><b>Numero</b><br /> {nota[0].numero}</p>
                                        <p className="serie"><b>Série</b><br />{nota[0].serie}</p>
                                        <p className="data"><b>Data de emissão</b><br /> {nota[0].data}</p>
                                        <p className="operacao"><b>Natureza de operação</b> <br /> {nota[0].operacao}</p>
                                    </div>
                                    <div className="produto-sessao-tres">
                                        <p className="emitente"><b>Emitente</b><br />{nota[1].nomeEmit}</p>
                                        <p><b>CNPJ</b><br /> {nota[1].cnpjEmit}</p>
                                        <p> <b>UF</b><br />{nota[1].ufEmit} </p>
                                        <p className="inscricaoestadual"><b>IE</b><br />{nota[1].ieEmit}</p>
                                        <p className="regime"><b>Regime Tributario:</b><br /> {nota[1].regimeEmit}</p>
                                    </div>
                                    <div className="produto-sessao-quatro">
                                        <p className="destinatario"><b>Destinatario</b><br />{nota[2].nomeDest} <br /></p>
                                        <p><b>Regime Tributario:</b><br /> {nota[2].regimeDest} <br /></p>
                                        <p className="cpf"><b>CPF:</b><br />{nota[2].cpfDest} </p>
                                        <p className="uf-destinatario"><b>UF:</b><br />{nota[2].ufDest}</p>
                                    </div>
                                </div>

                                <div className="produtos-sessao-impostos">
                                    <div className="icms">
                                        <h4>ICMS <span>{this.retornaAlq(nota[3], 1)}%</span></h4>
                                        <p>R$ {this.calculaImpostos(nota[3], 1)}</p>
                                    </div>
                                    <div className="cofins">
                                        <h4>COFINS <span>{this.retornaAlq(nota[3], 2)}%</span></h4>
                                        <p>R$ {this.calculaImpostos(nota[3], 2)}</p>
                                    </div>
                                    <div className="pis">
                                        <h4>PIS <span>{this.retornaAlq(nota[3], 3)}%</span></h4>
                                        <p>R$ {this.calculaImpostos(nota[3], 3)}</p>
                                    </div>
                                    <div className="bc">
                                        <h4>BC</h4>
                                        <p>R$ {this.calculaImpostos(nota[3], 4)}</p>
                                    </div>
                                </div>

                                <div className="produtos-lista">
                                    <div className="produtos-lista-cabecalho">
                                        <p>Nome</p>
                                        <p className="produtos-lista-cabecalho-ncm">NCM</p>
                                        <p>CFOP</p>
                                        <p>QTD</p>
                                        <p className="produtos-lista-cabecalho-unidade">Unidade</p>
                                        <p>Valor Unitário</p>
                                        <p>Valor total</p>
                                    </div>
                                    <div className="produtos-lista-container">
                                        {this.mapProdutos(nota[3])}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </li >
            ));

        } else {
            return (
                <ul>
                    <li>Conteudo não encontrado</li>
                </ul>
            );
        }
    }

    render() {
        return (
            <section className="tabela">
                <div>
                    <ul className="tabela-cabecalho">
                        <li key='espaco-img' className="tabela-cabecalho-img"></li>
                        <li key='numero' className="tabela-cabecalho-numero">N°</li>
                        <li key='emitente'>Emitente</li>
                        <li key='cnpj' className="tabela-cabecalho-cnpj">CNPJ</li>
                        <li key='data' className="tabela-cabecalho-data">Data de emissão</li>
                        <li key='valor-total'>Valor total</li>
                        <li key='status' className="tabela-cabecalho-status">Status</li>
                        <li key='espaco-excluir'></li>
                        <li key='espaco-mover'></li>
                    </ul>
                </div>
                <ul className="tabela-ul">
                    {this.notas()}
                </ul>
            </section>
        )
    }

}
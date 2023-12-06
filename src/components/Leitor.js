import axios from "axios";

export default class Leitor {
    constructor(evento, cb, mostraErro, mostraCarregamento) {

        const arquivos = evento.target.files;

        this.leitor(arquivos, mostraErro, mostraCarregamento)
            .then(nfe => {

                cb(nfe);

                return;

            })
            .catch(erro => console.error(erro));


    }

    async leitor(arquivos, mostraErro, mostraCarregamento) {

        return new Promise((resolve, reject) => {

            if (arquivos.length > 5) {
                mostraCarregamento(1);
                mostraErro(2);
                reject('Quantidade máxima excedida');
                return;
            }

            const resultado = []

            for (const arquivo of arquivos) {

                const leitor = new FileReader();

                leitor.onload = (evento) => {

                    this.documento(evento).then(nfe => {

                        resultado.push(nfe);

                        if (resultado.length === arquivos.length) {

                            resolve(resultado); // Se o tamanho do resultado for igual o tamanho do arquivo, resolve o Promise.

                        }

                    });


                }

                // Trata o erro na leitura de arquivo
                leitor.addEventListener('error', e => {
                    reject(e.target.error);
                });


                leitor.readAsText(arquivo);

            }


        });


    }

    async documento(evento) {

        const xmlTxt = evento.target.result;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlTxt, 'text/xml');

        // Captura os caminhos para capturar os valores dentro do parse.
        const caminhoInfo = xmlDoc.getElementsByTagName('ide');

        const caminhoChave = xmlDoc.getElementsByTagName('infNFe');

        const caminhoStatus = xmlDoc.getElementsByTagName('infProt');

        const caminhoTotal = xmlDoc.getElementsByTagName('ICMSTot');

        const caminhoEmit = xmlDoc.getElementsByTagName('emit');

        const caminhoDest = xmlDoc.getElementsByTagName('dest');

        const caminhoProd = xmlDoc.getElementsByTagName('prod');

        const caminhoProdImp = xmlDoc.getElementsByTagName('imposto');

        const nfe = [this.buscaInfo(caminhoInfo, caminhoChave, caminhoStatus, caminhoTotal), await this.buscaEmit(caminhoEmit), this.buscaDest(caminhoDest), this.buscaProd(caminhoProd, caminhoProdImp)];

        const caminhoImp = xmlDoc.getElementsByTagName('imposto');
        if (caminhoImp[0].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMSSN102').length > 0) {
            nfe.push(this.buscaCSOSN(caminhoImp));
        } else if (caminhoImp[0].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMS60').length > 0) {
            nfe.push(this.buscaCST(caminhoImp));
        };

        return nfe; // Retorna o array com o resultado dos objetos.

    }


    buscaInfo(caminho, chave, status, total) {

        let resultadoInfo = {};

        for (let i = 0; i < caminho.length; i++) {
            const operacao = caminho[i].getElementsByTagName('natOp')[0]?.textContent || 'N/A';
            const numero = caminho[i].getElementsByTagName('nNF')[0]?.textContent || 'N/A';
            const serie = caminho[i].getElementsByTagName('serie')[0]?.textContent || 'N/A';
            const valorTotal = total[i].getElementsByTagName('vNF')[0]?.textContent || 'N/A';

            //Formata data
            const data = caminho[i].getElementsByTagName('dhEmi')[0].textContent;
            const dataFormatada = this.formataData(data);

            //Formata a chave de acesso
            const chaveAcesso = chave[i].getAttribute('Id');
            const chaveFormatada = chaveAcesso.slice(3); // Retira as letras NFe da string

            //Formata Status
            const situacao = this.verificaStatus(status);

            resultadoInfo.operacao = operacao;
            resultadoInfo.numero = numero;
            resultadoInfo.serie = serie;
            resultadoInfo.data = dataFormatada;
            resultadoInfo.status = situacao;
            resultadoInfo.chave = chaveFormatada;
            resultadoInfo.total = valorTotal;
        }

        return resultadoInfo;

    }

    verificaStatus(status) {
        const stringStatus = status[0].getElementsByTagName('cStat')[0].textContent;
        const numeroStatus = Number(stringStatus);

        if (numeroStatus === 100) {
            return 'Autorizado';
        } else {
            return 'Cancelado';
        }
    }

    formataData(data) {
        const dataCorreta = data.slice(0, -6);
        const dataObjeto = new Date(dataCorreta);
        const opcoesDeFormato = {
            year: "numeric",
            month: "short",
            day: "2-digit",
        };
        const formatoBrasileiro = new Intl.DateTimeFormat('pt-BR', opcoesDeFormato);
        const dataFormatada = formatoBrasileiro.format(dataObjeto);

        return dataFormatada;
    }

    async buscaEmit(caminho) {

        let resultadoEmit = {};

        for (let i = 0; i < caminho.length; i++) {

            const nomeEmit = caminho[i].getElementsByTagName('xNome')[0]?.textContent || 'N/A';
            const cnpjEmit = caminho[i].getElementsByTagName('CNPJ')[0]?.textContent || 'N/A';
            const ufEmit = caminho[i].getElementsByTagName('enderEmit')[0].getElementsByTagName('UF')[0]?.textContent || 'N/A';
            const ieEmit = caminho[i].getElementsByTagName('IE')[0]?.textContent || 'N/A';

            try {

                //Busca Regime Tributario
                const regime = await this.buscaRegime(cnpjEmit);

                resultadoEmit.nomeEmit = nomeEmit;
                resultadoEmit.cnpjEmit = cnpjEmit;
                resultadoEmit.ufEmit = ufEmit;
                resultadoEmit.ieEmit = ieEmit;
                resultadoEmit.regimeEmit = regime;

            } catch (error) {

                console.log('Erro: ' + error)

            }

        }

        try {

            await Promise.all(Object.values(resultadoEmit));

            return resultadoEmit;

        } catch (error) {

            console.log('Erro: ' + error);

        }

    }

    async buscaRegime(cnpj) {

        return new Promise((resolve, reject) => {

            const CHAVE = process.env.REACT_APP_MINHA_CHAVE;

            const config = {
                method: 'get',
                url: `https://api.cnpja.com/office/${cnpj}?simples=true`,
                headers: {
                    Authorization: `${CHAVE}`
                },
                params: {
                    strategy: 'CACHE',
                    maxAge: 365
                }
            }

            axios(config).then(response => {

                if (response.data.company.simei.optant === true) {

                    resolve('Mei');

                } else if (response.data.company.simples.optant === true) {

                    resolve('Simples Nacional');

                } else {

                    resolve('Lucro Presumido');
                }


            }).catch(error => {

                reject(error);

            })

        })

    }

    buscaDest(caminho) {

        let resultadoDest = {};

        for (let i = 0; i < caminho.length; i++) {
            const nomeDest = caminho[i].getElementsByTagName('xNome')[0]?.textContent || 'N/A';
            const cpfDest = caminho[i].getElementsByTagName('CPF')[0]?.textContent || 'N/A';
            const ufDest = caminho[i].getElementsByTagName('enderDest')[0].getElementsByTagName('UF')[0]?.textContent || 'N/A';
            const regimeDest = 'Simples Nacional';

            resultadoDest.nomeDest = nomeDest;
            resultadoDest.cpfDest = cpfDest;
            resultadoDest.ufDest = ufDest;
            resultadoDest.regimeDest = regimeDest;
        }

        return resultadoDest;

    }

    buscaProd(caminho, imposto) {

        let resultadoProd = [];


        for (let i = 0; i < caminho.length; i++) {

            const produto = {};
            produto.nome = caminho[i].getElementsByTagName('xProd')[0]?.textContent || 'N/A';
            produto.valorUnit = caminho[i].getElementsByTagName('vUnCom')[0]?.textContent || 'N/A';
            produto.valorTotal = caminho[i].getElementsByTagName('vProd')[0]?.textContent || 'N/A';
            produto.ncm = caminho[i].getElementsByTagName('NCM')[0]?.textContent || 'N/A';
            produto.cfop = caminho[i].getElementsByTagName('CFOP')[0]?.textContent || 'N/A';
            produto.qtd = caminho[i].getElementsByTagName('indTot')[0]?.textContent || 'N/A';
            produto.unidade = caminho[i].getElementsByTagName('uCom')[0]?.textContent || 'N/A';

            // Busca o ICMS
            const icms = this.buscaICMS(imposto, i);
            produto.icmsAlq = icms;

            // Busca o PIS
            const pis = this.buscaPIS(imposto, i);
            produto.pisAlq = pis;

            // Busca COFINS
            const cofins = this.buscaCOFINS(imposto, i);
            produto.cofinsAlq = cofins;


            resultadoProd.push(produto);

        }

        return resultadoProd;

    }

    buscaICMS(imposto, i) {

        if (imposto[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMSSN102')[0]) {

            const icms = imposto[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMSSN102')[0].getElementsByTagName('pICMS')[0]?.textContent || '0.0000';
            return icms;

        } else if (imposto[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMS20')[0]) {

            const icms = imposto[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMS20')[0].getElementsByTagName('pICMS')[0]?.textContent || '0.0000';
            return icms;

        } else if (imposto[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMSSN500')[0]) {

            const icms = imposto[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMSSN500')[0].getElementsByTagName('pICMS')[0]?.textContent || '0.0000';
            return icms;

        } else if (imposto[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMS60')[0]) {

            const icms = imposto[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMS60')[0].getElementsByTagName('pICMS')[0]?.textContent || '0.0000';
            return icms;

        } else {

            console.log('Aliquota ICMS não encontrado');
            return;
        }

    }

    buscaPIS(imposto, i) {

        if (imposto[i].getElementsByTagName('PIS')[0].getElementsByTagName('PISAliq')[0]) {

            const pis = imposto[i].getElementsByTagName('PIS')[0].getElementsByTagName('PISAliq')[0].getElementsByTagName('pPIS')[0]?.textContent || '0.0000';
            return pis;

        } else if (imposto[i].getElementsByTagName('PIS')[0].getElementsByTagName('PISOutr')[0]) {

            const pis = imposto[i].getElementsByTagName('PIS')[0].getElementsByTagName('PISOutr')[0].getElementsByTagName('pPIS')[0]?.textContent || '0.0000';
            return pis;

        } else if (imposto[i].getElementsByTagName('PIS')[0].getElementsByTagName('PISNT')[0]) {

            const pis = imposto[i].getElementsByTagName('PIS')[0].getElementsByTagName('PISNT')[0].getElementsByTagName('pPIS')[0]?.textContent || '0.0000';
            return pis;
        } else {

            console.log('Aliquota PIS não encontrado');
            return;

        }

    }

    buscaCOFINS(imposto, i) {

        if (imposto[i].getElementsByTagName('COFINS')[0].getElementsByTagName('COFINSOutr')[0]) {

            const cofins = imposto[i].getElementsByTagName('COFINS')[0].getElementsByTagName('COFINSOutr')[0].getElementsByTagName('pCOFINS')[0]?.textContent || '0.0000';
            return cofins;

        } else if (imposto[i].getElementsByTagName('COFINS')[0].getElementsByTagName('COFINSAliq')[0]) {

            const cofins = imposto[i].getElementsByTagName('COFINS')[0].getElementsByTagName('COFINSAliq')[0].getElementsByTagName('pCOFINS')[0]?.textContent || '0.0000';
            return cofins;

        } else if (imposto[i].getElementsByTagName('COFINS')[0].getElementsByTagName('COFINSNT')[0]) {

            const cofins = imposto[i].getElementsByTagName('COFINS')[0].getElementsByTagName('COFINSNT')[0].getElementsByTagName('pCOFINS')[0]?.textContent || '0.0000';
            return cofins;

        } else {

            console.log('Aliquota COFINS não encontrado');
            return;
        }

    }

    buscaCSOSN(caminho) {

        let resultadoCSOSN;

        for (let i = 0; i < caminho.length; i++) {

            const orig = caminho[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMSSN102')[0].getElementsByTagName('orig')[0].textContent;
            const csosnOrig = caminho[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMSSN102')[0].getElementsByTagName('CSOSN')[0].textContent;
            const csosn = orig + csosnOrig;

            resultadoCSOSN = csosn;

        }

        return resultadoCSOSN;

    }

    buscaCST(caminho) {

        let resultadoCST;

        for (let i = 0; i < caminho.length; i++) {

            const orig = caminho[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMS60')[0].getElementsByTagName('orig')[0]?.textContent || 'N/A';
            const cstOrig = caminho[i].getElementsByTagName('ICMS')[0].getElementsByTagName('ICMS60')[0].getElementsByTagName('CST')[0]?.textContent || 'N/A';
            const cst = orig + cstOrig;

            resultadoCST = cst;

        }

        return resultadoCST;

    }

    getNFE() {

        return this.nfe;

    }

}



export default function Calculo(nfe) {

    for (const notas of nfe) {

        const ufEmit = notas[1].ufEmit;
        const ufDest = notas[2].ufDest;

        for (const produtos of notas[3]) {

            const bc = Number(produtos.valorTotal);
            const icmsAlq = Number(produtos.icmsAlq);
            const pisAlq = Number(produtos.pisAlq);
            const cofinsAlq = Number(produtos.cofinsAlq);

            if (ufEmit !== ufDest) {

                // Calcula ICMS
                const icmsInterestadual = bc * (icmsAlq / 100);
                const icmsAlqDestino = 7;
                const difalAlq = icmsAlq - icmsAlqDestino;
                const difal = bc * (difalAlq / 100);

                produtos.icms = icmsInterestadual;
                produtos.difal = difal;

                // Calcula PIS
                const pis = bc * (pisAlq / 100);
                produtos.pis = pis;

                // Calcula COFINS
                const cofins = bc * (cofinsAlq / 100);
                produtos.cofins = cofins;


            } else {

                // Calcula ICMS
                const icms = bc * (icmsAlq / 100);
                produtos.icms = icms;

                // Calcula PIS
                const pis = bc * (pisAlq / 100);
                produtos.pis = pis;

                // Calcula COFINS
                const cofins = bc * (cofinsAlq / 100);
                produtos.cofins = cofins;

            }

        }


    }

    localStorage.clear();
    localStorage.setItem('nfe', JSON.stringify(nfe));
    return nfe;

}
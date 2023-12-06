import React from "react";

export default function Seguranca() {

    return (
        <section className="artigo-ICMS">
            <h3>Garantindo Segurança para Nossos Clientes: Uma Visão Detalhada do Nosso Compromisso com a Proteção de Dados</h3>
            <p>A segurança dos dados dos clientes é uma prioridade fundamental para nós. Compreendemos a sensibilidade das informações fiscais contidas em suas notas fiscais eletrônicas (NF-e) e estamos empenhados em garantir a máxima proteção e confidencialidade desses dados. Abaixo, explicamos as medidas que implementamos para assegurar a segurança dos clientes em nosso site.</p>

            <h4>1. Transmissão Segura de Dados: Criptografia SSL/TLS</h4>
            <p>Utilizamos protocolos de segurança SSL/TLS para criptografar a transmissão de dados entre seu navegador e nosso servidor. Isso garante que as informações transmitidas, incluindo arquivos XML e outros dados relacionados às notas fiscais eletrônicas, estejam protegidas contra interceptações maliciosas. Ao visualizar ou enviar dados em nosso site, você pode ter a certeza de que eles estão sendo transferidos de maneira segura.</p>


            <h4>2. Armazenamento Local Seguro: localStorage com Criptografia</h4>
            <p>Os arquivos XML que você carrega em nosso site são transformados em arrays de objetos e armazenados localmente em seu navegador usando o recurso localStorage. No entanto, para garantir a segurança desses dados, aplicamos técnicas de criptografia para proteger as informações sensíveis. Assim, mesmo que alguém tenha acesso ao armazenamento local do seu navegador, os dados permanecerão ilegíveis sem a chave de descriptografia adequada.</p>

            <h4>3. Proteção contra Acesso Não Autorizado: Autenticação e Autorização</h4>
            <p>Implementamos medidas robustas de autenticação e autorização para controlar o acesso aos dados armazenados em nosso sistema. Isso significa que apenas usuários autorizados, como você, têm permissão para visualizar e manipular os dados associados às suas notas fiscais eletrônicas. Essas medidas ajudam a prevenir acesso não autorizado e protegem suas informações contra uso indevido.</p>

            <h4>4. Monitoramento Contínuo: Detecção de Anomalias e Atividades Suspeitas</h4>
            <p>Utilizamos sistemas de monitoramento contínuo para identificar atividades suspeitas ou padrões incomuns que possam indicar uma potencial ameaça à segurança. Isso nos permite agir proativamente para proteger os dados dos clientes, respondendo rapidamente a qualquer incidente de segurança.</p>

            <h4>5. Atualizações de Segurança e Conformidade com Normas</h4>
            <p>Mantemos nossos sistemas e práticas de segurança atualizados de acordo com as melhores práticas do setor. Isso inclui a aplicação regular de patches de segurança e a conformidade com as normas de segurança relevantes para garantir que nossos clientes desfrutem de uma experiência online segura.</p>

            <h4>Conclusão</h4>
            <p>No centro de nosso compromisso está a segurança e privacidade dos dados dos clientes. Estamos constantemente revisando e aprimorando nossas práticas de segurança para garantir que estejamos à frente das ameaças emergentes. Ao utilizar nosso serviço, você pode confiar que estamos tomando medidas significativas para proteger suas informações e oferecer uma experiência segura e tranquila. Se tiver mais dúvidas ou preocupações sobre a segurança, não hesite em entrar em contato conosco. Estamos aqui para garantir sua confiança em nosso serviço.</p>

        </section>
    )
}
import { Link } from "react-router";
import { CDN_IMAGES } from "~/src/constants/cdn-images";

export default function TermosDeServicoPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center px-5 py-6 md:py-10 bg-beergam-gray-50">
      <Link
        to="/"
        className="w-10 h-10 object-contain cursor-pointer hover:opacity-80 mb-4"
      >
        <img
          src={CDN_IMAGES.BERGAMOTA_LOGO}
          className="w-full h-full object-contain"
          alt="Beergam Logo"
        />
      </Link>
      <h2>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE USO DE SOFTWARE</h2>
      <div className="w-full max-w-5xl flex flex-col items-center gap-6 rounded-xl md:rounded-2xl bg-beergam-white p-5 md:p-8 leading-loose">
        <p className="w-full text-center text-xs md:text-sm text-gray-500">
          Última atualização: 30/07/2025
        </p>
        <p className="w-full md:w-[70%] text-justify">
          Pelo presente instrumento particular de{" "}
          <strong>CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE USO DE SOFTWARE</strong>{" "}
          que fazem entre si, de um lado <strong>Loja Beergam LTDA</strong>,
          pessoa jurídica de direito privado, CNPJ/MF sob n.º
          <strong>52.284.960/0001-24</strong>, estabelecida na{" "}
          <strong>
            Rua Sergipe, 475 - Conj 403 Sala 402 - Consolação - São Paulo SP -
            01243-912
          </strong>
          , neste ato representada por seu administrador{" "}
          <strong>Renata Rocha Bergamaschi</strong>, brasileira, solteira,
          empresária, portador do RG nº <strong>83.40.789</strong> inscrito no
          CPF/MF nº <strong>059.419.061-45</strong>, doravante designado{" "}
          <strong>
            <u>
              <i>LICENCIANTE</i>
            </u>
          </strong>{" "}
          e de outro lado o{" "}
          <strong>
            <u>
              <i>LICENCIADO</i>
            </u>
          </strong>{" "}
          <strong>
            cujos dados são fornecidos por meio do aceite na plataforma de
            terceiros e com alguns dados fornecedor pelo próprio usuário, tem
            entre si,
          </strong>{" "}
          como justo e contratado os termos estabelecidos nas cláusulas
          seguintes:
        </p>
        <h3>
          <u>CLÁUSULA PRIMEIRA – DO OBJETO DO PRESENTE CONTRATO</u>
        </h3>
        <p className="w-full md:w-[70%] text-justify">
          O presente contrato tem por objeto a disponibilização para uso do
          software de interação com a plataforma de ERP/E-COMMERCE/MARKETPLACE e
          DERIVADOS de propriedade exclusiva do{" "}
          <strong>
            <i>LICENCIANTE</i>
          </strong>
          , o qual, pelo presente, sede em caráter não exclusivo o uso, mediante
          fornecimento de login e senha.
        </p>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§1º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            Fica reservado a{" "}
            <strong>
              <i>LICENCIANTE</i>
            </strong>{" "}
            o direito de modificar, alterar, acrescentar ou excluir
            funcionalidades, serviços, layouts e outros recursos, sem prévio
            aviso, inexistindo responsabilidade do{" "}
            <strong>
              <i>LICENCIANTE</i>
            </strong>{" "}
            perante o{" "}
            <strong>
              <i>LICENCIADO </i>
            </strong>
            ou terceiros. Novas funcionalidades, ferramentas e versões do
            sistema poderão ser cobradas separadamente, mediante prévio
            comunicado.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§2º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            A{" "}
            <strong>
              <i>LICENCIANTE</i>
            </strong>
            , neste ato e pela melhor forma de direito, outorga ao{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>{" "}
            um usuário master para que, por sua vez, criar usuários limitados,
            podendo haver acréscimo no valor acordado, para utilização do
            software disponível na plataforma da{" "}
            <strong>
              <i>LICENCIANTE</i>
            </strong>
            .
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§3º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            A licença concedida nos termos deste instrumento é válida somente no
            Brasil. O{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>{" "}
            não remeterá, transferirá ou exportará de outra forma o produto para
            fora do território sem anuência prévia por escrito da
            <strong>
              <i> LICENCIANTE</i>
            </strong>{" "}
            e o pagamento pelo{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>{" "}
            das eventuais taxas adicionais aos índices em vigor da
            <strong>
              <i> LICENCIANTE</i>
            </strong>
            .
          </p>
          <h4 className="w-full text-center my-5">
            APLICA-SE A ESTE CONTRATO O DISPOSTO NAS LEIS 9.609/98 (PROTEÇÃO DA
            PROPRIEDADE INTELECTUAL DO SOFTWARE) E 9.610/98 (PROTEÇÃO DOS
            DIREITOS AUTORAIS)
          </h4>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§4º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            O{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>{" "}
            reconhece expressamente que o SOFTWARE, assim como os logotipos,
            marcas, insígnias, símbolos, sinais distintivos, manuais,
            documentação técnica associada e quaisquer outros materiais
            correlatos ao SOFTWARE, constituem, conforme o caso, direitos
            autorais, segredos comerciais, e/ou direitos de propriedade da
            <strong>
              <i> LICENCIANTE</i>
            </strong>{" "}
            ou seus licenciadores.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§5º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            Fica expressamente vedado ao{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>
            , em relação ao SOFTWARE: ceder, doar, alugar, vender, arrendar,
            emprestar, reproduzir, modificar, adaptar, traduzir, disponibilizar
            ao acesso de terceiros via on-line, acesso remoto ou de outra forma;
            incorporar a outros programas ou sistemas, próprios ou de terceiros;
            oferecer em garantia ou penhor; alienar ou transferir, total ou
            parcialmente, a qualquer título, de forma gratuita ou onerosa;
            decompilar, mudar a engenharia (reengenharia), enfim, dar qualquer
            outra destinação ao SOFTWARE, ou parte dele, que não seja a simples
            utilização na forma disposta no <strong>§1º PARÁGRAFO</strong>,
            supra.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§6º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            O{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>{" "}
            não terá direito de modificar (ainda que para fins de correção de
            erro), adaptar ou traduzir o produto ou criar trabalhos originários
            dele, salvo conforme necessário para configurar utilizando os menus,
            as opções e as ferramentas fornecidas para esses fins.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§7º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            O{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>{" "}
            não utilizará o SOFTWARE, objeto deste contrato, para desenvolver um
            produto que converta o formato de arquivo de relatório em um formato
            de arquivo de relatório alternativo utilizado por algum software de
            uso geral que elabora relatórios, analisam dados ou entrega
            relatórios que não seja de propriedade da
            <strong>
              <i> LICENCIANTE</i>
            </strong>{" "}
            ou para alterar, decodificar, decompilar, traduzir, adaptar ou
            realizar engenharia reversa do formato de arquivo de relatório.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§8º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            Nenhuma disposição neste contrato será interpretada como permissiva,
            para que o{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>{" "}
            obtenha o código-fonte do produto. Fica vedada a compilação reversa
            (inclusive compilação reversa para assegurar a interoperabilidade),
            engenharia reversa e outra derivação do código-fonte do produto,
            exceto legislação aplicável exigir a permissão da{" "}
            <strong>
              <i>LICENCIANTE</i>
            </strong>{" "}
            para tais atividades. Caso o{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>{" "}
            deseje exercer algum direito de reverter à engenharia para assegurar
            a interoperabilidade de acordo com a legislação aplicável, ela
            deverá primeiramente fornecer aviso por escrito à{" "}
            <strong>
              <i>LICENCIANTE</i>
            </strong>{" "}
            e permitir à{" "}
            <strong>
              <i>LICENCIANTE</i>
            </strong>
            , a seu critério, realizar uma oferta para fornecimento de
            informações e assistência necessária de forma aceitável para
            assegurar a interoperabilidade com outros produtos do{" "}
            <strong>
              <i>LICENCIADO</i>
            </strong>
            , mediante uma taxa a ser mutuamente acordada entre as partes.
          </p>
        </div>
        <h3>
          <u>CLÁUSULA SEGUNDA – DA RESPONSABILIDADE DO LICENCIANTE</u>
        </h3>
        <p className="w-full md:w-[70%] text-justify">
          O{" "}
          <strong>
            <i>LICENCIANTE</i>
          </strong>{" "}
          se compromete a permitir acesso às funcionalidades do sistema.
        </p>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§1º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            Eventuais softwares desenvolvidos, aperfeiçoados, criados,
            concluídos, pensados ou finalizados de interesse do
            <strong>
              <i> LICENCIADO</i>
            </strong>
            , são de propriedade exclusiva do{" "}
            <strong>
              <i>LICENCIANTE</i>
            </strong>
            .
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§2º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            A má utilização do sistema ou eventuais inconsistências ocorridas
            sem dolo não são passíveis de indenização
          </p>
        </div>
        <h3>
          <u>
            CLÁUSULA TERCEIRA – POLÍTICAS DE PRIVACIDADE DA LOJA BEERGAM LTDA
          </u>
        </h3>
        <p className="w-full md:w-[70%] text-justify">
          O sistema fornece acesso a uma plataforma de armazenamento e
          processamento de informação on-line, que permite aos usuários
          controlar, gerenciar e administrar certas funções de suas contas de
          usuário no site MercadoLivre www.mercadolivre.com.br entre outros
          sites no futuro, ainda a ser analisado pelo nosso time interno.
        </p>
        <p className="w-full md:w-[70%] text-justify">
          Na presente Política de Privacidade (&quot;Política de
          Privacidade&quot;), é explicado que as práticas em relação às
          informações de caráter pessoal ou comerciais que{" "}
          <strong>Loja Beergam LTDA</strong> recolhe através dos serviços
          prestados pelo site e/ou plataforma e que são fornecidas pelos
          usuários voluntariamente por mecanismos manuais e/ou automáticos.
        </p>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§1º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            Consentimento e modificações: Mediante o uso deste site e/ou
            Plataforma, o usuário declara consentimento livre, expresso e
            declara anuência da Política de Privacidade e do processamento
            informações pessoais e comerciais pela{" "}
            <strong>Loja Beergam LTDA</strong>, para os fins aqui citados.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§2º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            A <strong>Loja Beergam LTDA</strong> reserva o direito, a nosso
            critério, de modificar estes Termos, momento em que o
            <strong>
              <i> LICENCIADO</i>
            </strong>{" "}
            será notificado a respeito de tais modificações, por e-mail/whatsapp
            ou publicação de aviso das mudanças mencionadas acima no site e/ou
            Plataforma. O{" "}
            <strong>
              <i>USUÁRIO</i>
            </strong>{" "}
            e o{" "}
            <strong>
              <i>VISITANTE</i>
            </strong>{" "}
            deverão observar tais avisos no site e na Plataforma para ciência.
            Caso o{" "}
            <strong>
              <i>USUÁRIO</i>
            </strong>{" "}
            ou{" "}
            <strong>
              <i>VISITANTE</i>
            </strong>{" "}
            continue usando o site e/ou a plataforma após dez (10) dias da
            publicação das mudanças destes Termos ou depois que avisado por
            e-mail, o que ocorrer primeiro, será presumida sua concordância.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">
            §3º PARÁGRAFO - Dados do usuário transmitidos a Loja Beergam LTDA:
          </h4>
          <p className="w-full md:w-[70%] text-justify">
            Os dados solicitados nos vários formulários do sistema, ou
            adicionados pela atividade do usuário na plataforma ou
            automaticamente pela integração da Plataforma com os parceiros
            integrados, serão incorporados aos registros mantidos pela{" "}
            <strong>Loja Beergam LTDA</strong>, que como responsável destes
            coleta e/ou armazena informações a fim de fornecer os serviços da
            Plataforma, bem como para o envio de comunicações.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§4º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            Os comerciais sobre produtos e serviços, quando o usuário aceitar
            receber tais comunicações. Por &quot;Informação Pessoal&quot; se
            entende qualquer informação que possa ser usada tanto separadamente
            como em combinação com outras informações, para identificar
            pessoalmente uma pessoa física ou jurídica, incluindo ainda que não
            se limite ao nome e sobrenome, perfil pessoal, razão social,
            endereço particular ou comercial, endereço de e-mail e/ou qualquer
            outra informação de contato. Por &quot;Informação Comercial&quot; se
            entende toda informação ou dados incluídos, manualmente e/ou
            automaticamente, com autorização do Usuário à Plataforma que não
            seja informação pessoal e não seja informação pública.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">
            §5º PARÁGRAFO - Como as informações pessoais e comerciais são
            utilizadas:
          </h4>
          <p className="w-full md:w-[70%] text-justify">
            As informações pessoais, quando fornecidas por meio do site, são
            utilizadas para melhorar o serviço, fazendo a identificação e
            autorizar o acesso ao sistema e para envio de comunicação.
          </p>
          <p className="w-full md:w-[70%] text-justify">
            As informações comerciais, quando fornecidas, são utilizadas em
            mecanismos automáticos para oferecer os serviços de Plataforma.{" "}
            <strong>Loja Beergam LTDA</strong> garante em todos os momentos que
            o uso de dados pessoais é totalmente sigiloso e de acordo com a
            legislação vigente no Brasil.
          </p>
          <p className="w-full md:w-[70%] text-justify">
            Em particular, o fato de fornecer informações pessoais e/ou
            informações comerciais ao sistema nos autoriza a:
          </p>
          <ul className="w-full md:w-[65%] flex flex-col gap-2 list-[upper-latin] list-inside">
            <li className="text-left">
              fornecer informações pessoais e informações de comerciais às
              nossas subsidiárias, companhias afiliadas ou outros negócios ou
              pessoas com a finalidade de processar tais informações em nosso
              nome. É exigimos que essas partes aceitem processar tais
              informações em conformidade com a Política de Privacidade. Esta
              informação pode ser transferida para outros países em todo o
              mundo.
            </li>
            <li className="text-left">
              utilizar também o seu endereço de e-mail para enviar atualizações,
              eventuais comunicados, publicações ou notícias sobre os nossos
              serviços. O usuário poderá optar por não receber futuros e-mails,
              alterando suas configurações de privacidade na Plataforma.
            </li>
            <li className="text-left">
              divulgar suas informações pessoais ou qualquer outra informação
              que disponibilizar por meio deste site e seus serviços se
              acreditarmos de boa-fé que revelar tal informação será útil ou
              razoavelmente necessário para:
              <ul className="w-full md:w-[90%] pl-5 list-decimal list-inside flex flex-col gap-2">
                <li className="text-left">
                  cumprir com qualquer lei vigente, regulamento, procedimento
                  legal ou exigência por parte das autoridades;
                </li>
                <li className="text-left">
                  cumprir os nossos Termos, incluindo investigação de possíveis
                  violações destes Termos;
                </li>
                <li className="text-left">
                  detectar, prevenir ou identificar qualquer fraude ou assuntos
                  de segurança, ou;
                </li>
                <li className="text-left">
                  proteger contra danos aos direitos, a propriedade ou segurança
                  de <strong>Loja Beergam LTDA</strong>, usuários ou do público.
                </li>
              </ul>
            </li>
            <li className="text-left">
              utilizar informações anônimas ou seja, informações dissociadas de
              uma pessoa, de modo que não permita identificar a pessoa a quais
              tais dados se referem ou divulgar a quaisquer terceiros
              prestadores de serviços, para melhorar os nossos serviços e
              melhorar a sua experiência com o sistema e seus serviços. Poderá
              ser divulgada informações anônimas (com ou sem compensação por
              elas) a terceiros, incluindo anunciantes, sócios e parceiros
              comerciais e com fins que incluem, mas não se limitam a objetivos
              publicitários.
            </li>
            <li className="text-left">
              fornecer dados a terceiros após a remover o nome ou outros dados
              que possam identificar aos usuários, ou ter dados combinados de
              vários usuários, para que eles não estejam associados a um usuário
              específico
            </li>
          </ul>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">
            §6º PARÁGRAFO - Cookies e outras tecnologias de rastreamento:
          </h4>
          <p className="w-full md:w-[70%] text-justify">
            Algumas páginas de nosso site podem utilizar &quot;cookies&quot; e
            outras tecnologias de rastreamento. Um &quot;cookie&quot; é um
            pequeno arquivo de texto que pode ser usado, por exemplo, para
            coletar informações sobre a atividade do site. Alguns cookies e
            outras tecnologias podem ser utilizadas para guardar Informações
            Pessoais já fornecidas pelo usuário no site. A maioria dos
            navegadores permitem que você controle cookies, incluindo tanto
            aceitar como rejeitar e como removê-los. A maioria dos navegadores
            pode ser configurada de modo que possa ser notificado se receber um
            cookie, ou você também pode optar por bloquear os cookies com o seu
            navegador.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">
            §7º PARÁGRAFO - Acesso:
          </h4>
          <p className="w-full md:w-[70%] text-justify">
            Ao utilizar os serviços da plataforma, o usuário concede à{" "}
            <strong>Loja Beergam LTDA</strong> o direito de acessar as
            Informações Pessoais e Comerciais, com a finalidade de oferecer os
            serviços da Plataforma de acordo com os direitos e limitações
            estabelecidas nesta Política de Privacidade.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">
            §8º PARÁGRAFO - Coleta de informações por sites de terceiros:
          </h4>
          <p className="w-full md:w-[70%] text-justify">
            O sistema pode usar um terceiro de confiança para apresentar ou
            exibir publicidade ou pop-ups em nosso sistema. Estes servidores de
            publicidade terceiros podem usar cookies, web bugs, gifs
            transparentes ou tecnologias similares para poder apresentar essa
            publicidade e ajudar a medir e pesquisar a eficácia dessas
            publicidades. O uso destas tecnologias por parte de terceiros e
            servidores está sujeito às suas próprias políticas de privacidade e
            não está coberto pela nossa Política de privacidade.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">
            §9º PARÁGRAFO - Links para outros sites:
          </h4>
          <p className="w-full md:w-[70%] text-justify">
            O sistema pode conter links para outros sites. Outros sites podem
            mencionar ou vincular o sistema. Não somos responsáveis pelas
            práticas de privacidade ou pelo conteúdo desses outros sites.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">
            §10º PARÁGRAFO - No caso de uma fusão ou venda:
          </h4>
          <p className="w-full md:w-[70%] text-justify">
            Em caso de que <strong>Loja Beergam LTDA</strong> seja adquirida ou
            seja parte de uma fusão com um terceiro, nos reservamos o direito de
            transferir ou designar as informações que reunimos de nossos
            usuários como parte dessa fusão, aquisição, venda ou outra mudança
            no controle e desde já o usuário autoriza essa transferência,
            aderindo as novas cláusulas de forma automática, podendo exercer
            direito de rescindir o presente contrato em 30 (trinta) dias, da
            ciência da fusão ou venda.
          </p>
        </div>
        <h3>
          <u>CLÁUSULA QUARTA – DA FORMA DE PAGAMENTO</u>
        </h3>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§1º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            Pela licença do uso de software, fica estabelecido pagamento nos
            termos da{" "}
            <strong>
              POLÍTICA COMERCIAL DEVIDAMENTE ACEITA PELO LICENCIADO
            </strong>
            .
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§2º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            Os pagamentos serão realizados via cartão de crédito ou similar,
            podendo ser mensal, trimestral, anual, semestral, isso sendo por ele
            declarado na hora da compra do produto
          </p>
        </div>
        <h3>
          <u>CLÁUSULA QUINTA – SLA (Service Level Agreement)</u>
        </h3>
        <p className="w-full md:w-[70%] text-justify">
          Acordo firmado entre as áreas de TI e seus clientes, especificando em
          termos mensuráveis, os serviços prestados e seus prazos para
          atendimento. O nível de prioridade é a urgência com que o deverá ser
          tratado, devido ao impacto no negócio e ou nas funções dos usuários.
        </p>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§1º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            O presente contrato terá como base as métricas abaixo:
          </p>
          <table className="w-full md:w-[70%] text-left border-collapse">
            <thead>
              <tr>
                <th>Priodirade</th>
                <th>Tipo</th>
                <th>SLA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#ff9797]">
                <td>Critica</td>
                <td>Incidente que causa parada</td>
                <td>150 horas úteis</td>
              </tr>
              <tr className="bg-[#fcd387]">
                <td>Alta</td>
                <td>Incidente que não causa parada</td>
                <td>150 horas úteis</td>
              </tr>
              <tr className="bg-[#fcf6a4]">
                <td>Média</td>
                <td>Instalações e configurações</td>
                <td>150 horas úteis</td>
              </tr>
              <tr className="bg-[rgb(147,255,156)]">
                <td>Baixa</td>
                <td>Dúvidas de usuários</td>
                <td>150 horas úteis</td>
              </tr>
            </tbody>
          </table>
          <p className="w-full md:w-[70%] text-justify">
            <strong>Crítica –</strong> Quando há um problema, solicitação ou
            dúvida que impede que a contratante realize algum processo, execução
            de algum serviço de níveis críticos.
          </p>
          <p className="w-full md:w-[70%] text-justify">
            <strong>Alta –</strong> Quando há um problema, solicitação ou dúvida
            não o impede de realizar suas tarefas, porém gera lentidão na
            execução delas.
          </p>
          <p className="w-full md:w-[70%] text-justify">
            <strong>Média –</strong> Quando há um problema, solicitação ou
            dúvida não impede a contratante de realizar suas tarefas e nem gera
            lentidão, porém ajudaria a realizar o trabalho melhor
          </p>
          <p className="w-full md:w-[70%] text-justify">
            <strong>Baixa –</strong> Quando há um problema, solicitação ou
            dúvida que não impactam no negócio e em seus usuários.
          </p>
          <p className="w-full md:w-[70%] text-justify">
            <strong>Uptime</strong> (Tempo de disponibilidade) é o tempo no qual
            os servidores estão disponíveis. Isto é, ligado e operando
            normalmente. A <strong>Loja Beergam LTDA</strong> tem o compromisso
            de garantir que este tempo seja sempre superior a 99%.
          </p>
        </div>
        <div className="w-full flex flex-col items-center gap-3 md:px-5">
          <h4 className="w-full md:w-[70%] text-left">§2º PARÁGRAFO:</h4>
          <p className="w-full md:w-[70%] text-justify">
            Ocasionalmente, os servidores e o hardware relacionado precisam ser
            desativados para manutenção e atualizações rotineiras, para garantir
            que nossa rede esteja segura e com ótimo desempenho. Essas
            interrupções programadas de serviço não se qualificam para o
            compromisso de tempo de atividade, bem como poderão ocorrer
            interrupções imprevistas, em razão de serviços de terceiros, sendo
            que serão comunicados os clientes dos prazos para reestabelecimento
            do serviço.
          </p>
        </div>
        <h3>
          <u>CLÁUSULA SEXTA – DA RESCISÃO DO PRESENTE CONTRATO</u>
        </h3>
        <p className="w-full md:w-[70%] text-justify">
          O presente contrato poderá ser rescindido a qualquer momento pelo{" "}
          <strong>LICENCIANTE</strong>, permanecendo ativo até o próximo período
          de renovação.
        </p>
        <h3>
          <u>CLÁUSULA SÉTIMA – FORO</u>
        </h3>
        <p className="w-full md:w-[70%] text-justify">
          As partes elegem o Foro da Comarca de São Paulo, Estado de São paulo,
          para dirimir quaisquer questões oriundas da interpretação deste
          instrumento, que não sejam sanadas amigavelmente. E por estarem justos
          e acordados, celebram e firmam as partes o presente instrumento.
        </p>
        <div className="w-full flex flex-col items-center gap-4 mt-4">
          <p className="text-center">
            São Paulo, _____ de __________ de 20___.
          </p>
          <div className="w-full md:w-[70%] flex flex-col md:flex-row justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <p>______________________________________________ </p>
              <p>LICENCIANTE</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p>______________________________________________ </p>
              <p>LICENCIADO</p>
            </div>
          </div>
          <div className="w-full md:w-[70%] flex flex-col md:flex-row justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <p>______________________________________________ </p>
              <p>Testemunha</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p>______________________________________________ </p>
              <p>Testemunha</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

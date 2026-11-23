// Editorial source. Run `node scripts/build-blog.mjs` after editing.
export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const code = (language, value) => `<div class="code-example"><span class="code-language">${escapeHtml(language)}</span><pre tabindex="0" aria-label="Exemplo de código: ${escapeHtml(language)}"><code>${escapeHtml(value)}</code></pre></div>`;

export const articles = [
  {
    slug: 'testes-javascript', category: 'JavaScript', topic: 'javascript', date: '2026-11-22',
    title: 'Testes em JavaScript: comece pela regra de negócio',
    description: 'Um exemplo de reserva de estoque para aprender a testar resultados, limites e erros usando o test runner nativo do Node.js.',
    image: 'assets/blog/software-tests.svg', imageAlt: 'Diagrama de três cenários de teste ligados a uma função JavaScript',
    intro: 'Uma tela pode parecer correta enquanto a regra por trás dela está errada. Testar uma função pequena é uma forma prática de começar a verificar o comportamento do sistema sem depender de cliques no navegador.',
    sections: [
      { id: 'defina-o-comportamento', title: 'Antes do teste, defina o comportamento', html: `<p>Considere um exemplo didático: uma função recebe o estoque disponível e a quantidade solicitada, e devolve o saldo depois da reserva. O objetivo aqui é testar uma regra isolada; não representar a implementação de um sistema de logística completo.</p><p>Antes de escrever código, descreva o contrato: estoque e quantidade devem ser números inteiros, o estoque não pode ser negativo, a quantidade precisa ser positiva e a reserva não pode superar o saldo. Com essas decisões explícitas, os testes passam a responder perguntas concretas.</p><p>Por exemplo: reservar três unidades de um estoque de dez deve retornar sete. Reservar todas deve retornar zero. Pedir mais do que existe deve gerar um erro, em vez de produzir um saldo negativo.</p>` },
      { id: 'isole-a-regra', title: 'Isole a regra da interface', html: `<p>Crie o arquivo <code>estoque.mjs</code>. A função não precisa conhecer formulários, banco de dados ou mensagens da interface. Ela recebe valores e devolve um resultado, ou informa que a operação é inválida.</p>${code('JavaScript · estoque.mjs', `export function reservar(estoque, quantidade) {
  if (!Number.isInteger(estoque) || estoque < 0) {
    throw new TypeError('Estoque inválido');
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    throw new TypeError('Quantidade inválida');
  }

  if (quantidade > estoque) {
    throw new RangeError('Estoque insuficiente');
  }

  return estoque - quantidade;
}`)}<p>Essa separação permite mudar a apresentação sem reescrever a regra. Também evita que cada teste precise montar uma página inteira só para verificar uma subtração com restrições.</p>` },
      { id: 'escreva-os-cenarios', title: 'Teste o caminho esperado e os limites', html: `<p>Em um Node.js com suporte ao test runner nativo, crie <code>estoque.test.mjs</code> ao lado da função. O módulo <code>node:test</code> organiza os cenários; <code>node:assert/strict</code> compara resultados e verifica exceções.</p>${code('JavaScript · estoque.test.mjs', `import test from 'node:test';
import assert from 'node:assert/strict';
import { reservar } from './estoque.mjs';

test('desconta a quantidade reservada', () => {
  assert.equal(reservar(10, 3), 7);
});

test('permite reservar todo o saldo', () => {
  assert.equal(reservar(3, 3), 0);
});

test('rejeita uma reserva acima do saldo', () => {
  assert.throws(() => reservar(2, 3), RangeError);
});

test('rejeita quantidade igual a zero', () => {
  assert.throws(() => reservar(10, 0), TypeError);
});

test('rejeita estoque negativo', () => {
  assert.throws(() => reservar(-1, 1), TypeError);
});`)}<p>Execute o comando abaixo na pasta dos dois arquivos. Não é necessário instalar uma biblioteca de testes para este exemplo.</p>${code('Terminal', 'node --test estoque.test.mjs')}` },
      { id: 'revise-o-que-falta', title: 'Use os testes para revelar decisões que faltam', html: `<p>Depois dos primeiros cenários, pergunte o que ainda não foi decidido. Quantidades fracionadas seriam permitidas em outro domínio? O formulário entrega números ou textos? A resposta deve orientar o contrato da função e a conversão de dados na entrada da aplicação.</p><p>Experimente acrescentar casos para números fracionados e valores como <code>"3"</code>. Nesta implementação, ambos devem ser rejeitados. Depois altere a regra de propósito e veja se o teste correspondente falha: isso ajuda a conferir se a verificação realmente protege o comportamento descrito.</p><p>Uma suíte verde confirma apenas os cenários exercitados. Integrações, persistência e concorrência exigem outras verificações. O primeiro passo útil é ter testes pequenos, com nomes que expliquem a intenção e falhas que apontem uma regra específica.</p>` }
    ],
    references: [
      { title: 'Node.js — Test runner', url: 'https://nodejs.org/api/test.html' },
      { title: 'Node.js — Assert', url: 'https://nodejs.org/api/assert.html' }
    ]
  },
  {
    slug: 'acessibilidade-teclado', category: 'Front-end', topic: 'frontend', date: '2026-11-22',
    title: 'Um menu acessível começa pelo teclado',
    description: 'Como criar uma navegação expansível com botão nativo, estado acessível, foco visível e uma verificação manual simples.',
    image: 'assets/blog/keyboard-accessibility.svg', imageAlt: 'Ilustração das teclas Tab, Enter e Escape com um indicador de foco',
    intro: 'Se a navegação depende de acertar um ícone com o mouse, parte da experiência ficou de fora. Um teste com teclado revela rapidamente se os controles podem ser encontrados, acionados e compreendidos.',
    sections: [
      { id: 'comece-pelo-html', title: 'Use o elemento que já sabe ser um botão', html: `<p>Para abrir ou fechar uma região da página, comece com <code>&lt;button type="button"&gt;</code>. Ele já participa da navegação por teclado e responde à ativação nativa. Um <code>div</code> com um evento de clique exigiria recriar parte desse comportamento.</p><p>Uma navegação de site comum pode ser tratada como uma região expansível. Ela não precisa receber o papel ARIA de menu de aplicativo, que traz outras expectativas de interação. Links continuam sendo links, e o botão controla a visibilidade deles.</p><p>No exemplo, o botão começa oculto e os links começam disponíveis. Assim, sem JavaScript, a navegação continua utilizável. O script apresenta o controle e passa a administrar o estado expandido.</p>${code('HTML', `<button id="abrir-navegacao" type="button"
  aria-expanded="false" aria-controls="navegacao" hidden>
  Navegação
</button>

<nav id="navegacao" aria-label="Principal">
  <a href="index.html">Início</a>
  <a href="blog.html">Blog</a>
</nav>`)}` },
      { id: 'sincronize-o-estado', title: 'Mantenha visibilidade e estado de acordo', html: `<p>O atributo <code>aria-expanded</code> informa se o conteúdo controlado está aberto. O atributo <code>hidden</code> oculta a região quando ela não deve estar disponível. Atualize os dois na mesma função para evitar uma interface visível que seja anunciada como fechada, ou o contrário.</p>${code('JavaScript · executar após o HTML', `const botao = document.getElementById('abrir-navegacao');
const navegacao = document.getElementById('navegacao');

function definirAberto(aberto) {
  botao.setAttribute('aria-expanded', String(aberto));
  navegacao.hidden = !aberto;
}

botao.hidden = false;
definirAberto(false);

botao.addEventListener('click', () => {
  const aberto = botao.getAttribute('aria-expanded') === 'true';
  definirAberto(!aberto);
});

document.addEventListener('keydown', (evento) => {
  const focoNaNavegacao = navegacao.contains(document.activeElement);
  const focoNoBotao = document.activeElement === botao;

  if (evento.key === 'Escape' && !navegacao.hidden &&
      (focoNaNavegacao || focoNoBotao)) {
    definirAberto(false);
    botao.focus();
  }
});`)}<p>Enter e Espaço acionam o botão por seu comportamento nativo. O tratamento adicional de Escape fecha a região quando o foco está nela ou no próprio controle e devolve o foco ao botão. Como essa navegação não é modal, a pessoa pode seguir usando Tab para sair dela.</p>` },
      { id: 'preserve-o-foco', title: 'Deixe claro onde o foco está', html: `<p>O foco precisa se destacar do fundo. Remover o contorno sem oferecer outro indicador faz a navegação parecer perdida. Uma regra simples pode usar a cor de destaque do próprio site:</p>${code('CSS', `button:focus-visible,
a:focus-visible {
  outline: 2px solid #c1ed78;
  outline-offset: 5px;
}

button {
  min-height: 44px;
  padding: 10px 16px;
}

[hidden] {
  display: none !important;
}`)}<p>O seletor de <code>hidden</code> evita que outra regra visual, como <code>display: flex</code>, faça o conteúdo fechado reaparecer. O tamanho do controle também facilita o toque em telas pequenas.</p>` },
      { id: 'teste-a-navegacao', title: 'Faça uma volta completa sem o mouse', html: `<ol><li>Use Tab até chegar ao botão e confira se o foco está visível.</li><li>Abra com Enter; repita usando Espaço.</li><li>Avance pelos links com Tab e volte com Shift + Tab.</li><li>Pressione Escape dentro da navegação: ela deve fechar e o foco deve voltar ao botão.</li><li>Confirme que os links ocultos deixam de participar da sequência de Tab.</li><li>Desative o JavaScript e confirme que os links iniciais continuam disponíveis.</li></ol><p>Esse roteiro não substitui uma avaliação completa de acessibilidade. Ele cobre um conjunto pequeno e verificável de comportamentos que costuma ser esquecido quando a revisão se limita ao visual.</p>` }
    ],
    references: [
      { title: 'W3C WAI — Disclosure pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/' },
      { title: 'MDN — O elemento button', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/button' },
      { title: 'MDN — O atributo hidden', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/hidden' }
    ]
  },
  {
    slug: 'git-commits-branches', category: 'Workflow', topic: 'workflow', date: '2026-11-22',
    title: 'Git: commits pequenos, histórico que faz sentido',
    description: 'Um fluxo simples para inspecionar alterações, criar uma branch, preparar um commit e revisar exatamente o que será registrado.',
    image: 'assets/blog/git-workflow.svg', imageAlt: 'Diagrama de commits com uma branch que se separa e volta à linha principal',
    intro: 'O histórico de um projeto também é uma forma de comunicação. Um commit que responde a uma mudança clara ajuda a revisar o trabalho e a entender por que uma decisão foi tomada.',
    sections: [
      { id: 'uma-mudanca-por-vez', title: 'Defina a intenção antes de agrupar arquivos', html: `<p>“Pequeno” não significa uma quantidade fixa de linhas. Um commit útil reúne uma alteração coerente: corrigir uma validação, adicionar uma página de artigo ou ajustar o menu no celular. A ideia é conseguir explicar o resultado em uma frase.</p><p>Misturar uma correção de comportamento, uma troca de formatação e uma funcionalidade nova torna a revisão mais cansativa. Se os assuntos podem ser entendidos e validados separadamente, vale separá-los no histórico também.</p><p>Antes de começar, observe o estado do repositório. Assim você distingue o que já estava em andamento daquilo que vai mudar agora.</p>${code('Terminal', 'git status --short\ngit diff')}` },
      { id: 'crie-uma-branch', title: 'Dê um contexto ao trabalho com uma branch', html: `<p>Uma branch permite desenvolver uma linha de trabalho com um nome reconhecível. O comando abaixo cria uma branch e passa a trabalhar nela. O nome é um exemplo: use algo que descreva o objetivo da alteração.</p>${code('Terminal', 'git switch -c feat/paginas-artigos')}<p>Criar a branch não publica o projeto nem abre um pull request. É uma organização local do trabalho. Alterações que ainda não foram registradas não se tornam um backup só porque você mudou de branch; continue inspecionando e registrando o que estiver pronto.</p>` },
      { id: 'revise-o-commit', title: 'Escolha o que vai entrar e revise novamente', html: `<p>O próximo exemplo supõe que <code>blog.html</code> e <code>artigos/novo-artigo.html</code> sejam os arquivos alterados para uma publicação. Adicionar caminhos explícitos ajuda a perceber se algum arquivo entrou por engano.</p>${code('Terminal', `git add blog.html artigos/novo-artigo.html
git diff --staged
git status --short`)}<p>O conteúdo preparado fica na área de staging. A revisão de <code>git diff --staged</code> mostra o que está pronto para o próximo commit. Se você editar o arquivo depois de executar <code>git add</code>, a nova edição precisa ser preparada novamente para fazer parte desse mesmo registro.</p><p>Quando a mudança estiver revisada e validada, escreva uma mensagem que descreva o resultado.</p>${code('Terminal', 'git commit -m "Adiciona página de artigo e link no blog"')}` },
      { id: 'corrija-a-selecao', title: 'Retire um arquivo da seleção sem apagar a edição', html: `<p>Se um arquivo entrou na área de staging antes da hora, você pode retirar essa seleção com o comando abaixo. Neste uso, <code>--staged</code> atua sobre o índice; as edições no arquivo de trabalho permanecem.</p>${code('Terminal', 'git restore --staged blog.html')}<p>Confira o resultado com <code>git status</code> e continue a revisão. Entender a diferença entre o arquivo de trabalho, a área de staging e o histórico evita tratar todos os comandos de restauração como se fizessem a mesma coisa.</p>` },
      { id: 'deixe-uma-historia-legivel', title: 'Escreva para quem vai revisar depois', html: `<p>Uma mensagem como “ajustes” não conta o que mudou. “Corrige navegação dos artigos no blog” permite antecipar o objetivo antes mesmo de abrir o diff. Quando houver uma decisão menos óbvia, o corpo da mensagem pode explicar o motivo.</p><p>Antes de registrar, confira se o projeto continua funcionando e se não foram incluídos arquivos temporários. Esse cuidado não precisa transformar cada mudança em um processo longo: basta uma revisão proporcional ao que foi alterado.</p><p>O resultado é um histórico que ajuda na manutenção. Cada commit se torna uma etapa compreensível, em vez de um conjunto de arquivos sem relação aparente.</p>` }
    ],
    references: [
      { title: 'Git — git switch', url: 'https://git-scm.com/docs/git-switch' },
      { title: 'Git — git add', url: 'https://git-scm.com/docs/git-add' },
      { title: 'Git — git restore', url: 'https://git-scm.com/docs/git-restore' }
    ]
  },
  {
    slug: 'codigo-limpo', category: 'JavaScript', topic: 'javascript', date: '2026-07-26',
    title: 'Como pensar em código limpo desde o primeiro projeto',
    description: 'Nomes, funções e responsabilidades que deixam a intenção do código mais clara e facilitam a manutenção.',
    image: 'assets/blog/clean-code.png', imageAlt: 'Ilustração de uma função JavaScript com o título Clean Code',
    intro: 'Código limpo não nasce de regras decoradas. Ele aparece quando nomes, funções e arquivos contam claramente a intenção do sistema.',
    sections: [
      { id: 'intencao-clara', title: 'Deixe clara a intenção de cada parte', html: '<p>Código limpo começa antes de escrever a primeira função. O ponto principal é deixar claro o motivo de cada parte existir. Um nome bem escolhido, uma função pequena e um arquivo com responsabilidade definida já reduzem muito a dificuldade de manutenção.</p><p>Prefira nomes que expliquem o significado de um valor ou de uma ação no contexto do projeto. Quem lê deve entender o que está acontecendo sem precisar procurar uma explicação em outro arquivo.</p>' },
      { id: 'responsabilidades', title: 'Separe responsabilidades quando fizer sentido', html: '<p>Em projetos iniciais, é comum tentar resolver tudo no mesmo lugar. Quando a tela, a regra de negócio e o acesso a dados ficam misturados, um ajuste simples passa a afetar mais partes do sistema.</p><p>Separar responsabilidades ajuda a encontrar bugs e facilita os testes. A divisão deve acompanhar problemas concretos do código, em vez de criar camadas que ainda não têm uma função clara.</p>' },
      { id: 'revise-o-codigo', title: 'Revise pensando na próxima leitura', html: '<p>Uma boa prática é revisar o próprio código perguntando: eu entenderia isso daqui a um mês? Se a resposta for não, vale melhorar nomes, dividir blocos difíceis de acompanhar e remover duplicações antes de seguir para a próxima funcionalidade.</p><p>O objetivo da revisão é diminuir o esforço necessário para compreender e alterar o sistema. Uma solução mais curta nem sempre é mais clara; escolha a forma que comunica melhor a regra.</p>' }
    ]
  },
  {
    slug: 'componentes-react', category: 'Front-end', topic: 'frontend', date: '2026-07-18',
    title: 'Componentes React que continuam simples com o tempo',
    description: 'Como reconhecer responsabilidades e evitar que componentes pequenos acumulem regras difíceis de manter.',
    image: 'assets/blog/react-components.png', imageAlt: 'Diagrama ilustrativo de componentes de uma interface React',
    intro: 'Separar apresentação, estado e regras de negócio ajuda a manter o fluxo de uma interface compreensível conforme o projeto cresce.',
    sections: [
      { id: 'papel-do-componente', title: 'Dê um papel claro ao componente', html: '<p>Um componente fica mais fácil de entender quando sua responsabilidade é reconhecível. Uma tela pode organizar dados e interações, enquanto componentes menores apresentam uma parte da informação e recebem ações por meio de propriedades.</p><p>Ao ler o nome e as propriedades de um componente, deve ser possível formar uma ideia do que ele representa na interface. Se isso exige acompanhar muitos detalhes internos, talvez as responsabilidades ainda estejam misturadas.</p>' },
      { id: 'sinais-de-crescimento', title: 'Perceba os sinais de complexidade', html: '<p>Quando um componente cresce, procure sinais: muitos estados locais sem relação entre si, várias condições na apresentação, funções grandes e propriedades com significados ambíguos.</p><p>Nesses casos, extrair uma parte visual ou uma lógica reutilizável pode deixar o fluxo mais fácil de acompanhar. A extração deve dar um nome a uma responsabilidade real, e não apenas reduzir o número de linhas do arquivo original.</p>' },
      { id: 'extraia-com-criterio', title: 'Divida com um motivo, não com uma meta de arquivos', html: '<p>O objetivo não é criar muitos arquivos sem necessidade. É fazer com que cada parte da interface seja previsível, mais fácil de testar e simples de alterar quando uma necessidade nova aparecer.</p><p>Depois de uma extração, releia o componente que ficou. Se a sequência das decisões estiver mais clara e o novo componente tiver um papel compreensível, a divisão provavelmente ajudou.</p>' }
    ]
  },
  {
    slug: 'apis-rest', category: 'Back-end', topic: 'backend', date: '2026-07-10',
    title: 'APIs REST: o básico que precisa estar bem feito',
    description: 'Rotas claras, validação e respostas consistentes para tornar uma API mais previsível para quem a consome.',
    image: 'assets/blog/api-rest.png', imageAlt: 'Ilustração de uma requisição e resposta de API REST',
    intro: 'Antes de pensar em uma arquitetura complexa, vale cuidar do contrato que o restante da aplicação vai consumir.',
    sections: [
      { id: 'contrato-previsivel', title: 'Construa um contrato previsível', html: '<p>Uma API boa é previsível. Rotas devem representar recursos, os métodos HTTP precisam carregar significado e as respostas devem manter um formato consistente. Isso reduz a necessidade de tratamentos especiais no front-end.</p><p>Ao definir uma rota, pense em quem vai utilizá-la. O caminho, os dados esperados e os resultados possíveis precisam contar a mesma história. Uma documentação simples já ajuda a tornar esse acordo visível.</p>' },
      { id: 'validacao-e-erros', title: 'Trate validação e erros como parte da interface', html: '<p>Validação também faz parte do contrato. Dados inválidos precisam ser identificados na entrada, com mensagens claras e respostas coerentes. Isso evita que uma solicitação aparentemente aceita cause um problema silencioso mais adiante.</p><p>Quem consome a API deve conseguir distinguir uma entrada inválida, um recurso ausente e uma falha inesperada. O formato da mensagem deve ajudar a tratar o caso sem expor detalhes internos desnecessários.</p>' },
      { id: 'seguranca-e-operacao', title: 'Pense no funcionamento além da resposta', html: '<p>Autenticação, autorização, limites de requisição e registros de operação devem ser considerados conforme o contexto da aplicação. Uma API não fica pronta apenas porque um endpoint devolveu o resultado esperado em um teste manual.</p><p>Comece pelos fluxos que o produto precisa executar e pelas falhas que ele deve tratar. Depois valide essas situações de forma repetível, mantendo o contrato compreensível para quem desenvolve e para quem consome o serviço.</p>' }
    ]
  },
  {
    slug: 'modelagem-mysql', category: 'Banco de dados', topic: 'dados', date: '2026-07-02',
    title: 'Modelagem MySQL para sistemas pequenos',
    description: 'Entidades e relacionamentos que representam o domínio sem perder de vista as consultas da aplicação.',
    image: 'assets/blog/mysql-modeling.png', imageAlt: 'Ilustração de tabelas e relacionamentos de banco de dados',
    intro: 'Uma boa modelagem reduz duplicidade e deixa mais claras as relações que a aplicação precisa representar.',
    sections: [
      { id: 'entenda-o-dominio', title: 'Comece pelo que os dados representam', html: '<p>Mesmo em sistemas pequenos, o banco precisa contar a história do domínio. Tabelas, chaves e relacionamentos devem refletir como os dados se conectam no negócio.</p><p>Antes de criar tabelas, descreva as entidades principais e suas relações. Diferencie aquilo que identifica um registro daquilo que pode mudar durante sua existência. Esse desenho inicial ajuda a encontrar ambiguidades antes de elas aparecerem no código.</p>' },
      { id: 'evite-duplicidade', title: 'Observe repetições e inconsistências', html: '<p>Normalizar dados ajuda a reduzir repetições e inconsistências. Se uma mesma informação precisa ser alterada manualmente em vários lugares, uma atualização incompleta pode deixar o sistema com versões conflitantes do mesmo fato.</p><p>Ao separar os dados, confira também como a aplicação vai utilizá-los. A organização deve preservar o significado das informações e permitir as operações que o produto realmente precisa realizar.</p>' },
      { id: 'valide-as-consultas', title: 'Valide o desenho com perguntas reais', html: '<p>Liste as consultas frequentes: o que a tela precisa mostrar, quais filtros devem existir e como os registros serão atualizados ou removidos? Essas perguntas ajudam a verificar se os relacionamentos escolhidos atendem ao fluxo da aplicação.</p><p>Índices devem acompanhar padrões de acesso observados, e não apenas a expectativa de que tudo será pesquisado. Começar com entidades bem definidas e consultas compreensíveis facilita ajustes posteriores.</p>' }
    ]
  },
  {
    slug: 'rotina-estudos', category: 'Carreira', topic: 'carreira', date: '2026-06-24',
    title: 'Como organizar estudos sendo estudante de software',
    description: 'Objetivos pequenos, prática e revisão para transformar estudo em conhecimento que pode ser aplicado.',
    image: 'assets/blog/study-routine.png', imageAlt: 'Ilustração de uma rotina de estudos de desenvolvimento de software',
    intro: 'Projetos menores, revisão frequente e registro do aprendizado ajudam a transformar teoria em repertório.',
    sections: [
      { id: 'teoria-e-pratica', title: 'Aproxime a teoria de um problema', html: '<p>Estudar tecnologia exige equilíbrio entre teoria e prática. Ler sobre um conceito ajuda, mas construir algo com ele mostra onde aparecem as dúvidas reais.</p><p>Ao escolher um assunto, defina um resultado pequeno que você consiga observar. Em vez de tentar aprender um ecossistema inteiro, proponha uma interação, uma função ou uma consulta que possa ser construída e explicada.</p>' },
      { id: 'registre-o-aprendizado', title: 'Registre o caminho que você percorreu', html: '<p>Uma rotina pode ser simples: escolher um tema, criar um pequeno projeto, registrar o que aprendeu e revisar depois. Esse registro pode ajudar em novos projetos, no portfólio e na preparação para entrevistas.</p><p>Anote o problema, a decisão tomada e o que ainda não ficou claro. Um exemplo curto acompanhado de uma explicação costuma ser mais útil na revisão do que uma coleção de links sem contexto.</p>' },
      { id: 'revise-com-consistencia', title: 'Reserve espaço para voltar ao assunto', html: '<p>Consistência pesa mais que volume. Um período focado, com objetivo claro e código escrito, pode ser mais produtivo do que várias horas alternando entre conteúdos sem aplicar o que foi visto.</p><p>Volte a um exercício depois de alguns dias, tente resolvê-lo sem consultar a primeira solução e observe o que você consegue explicar. Use essa revisão para escolher o próximo passo, sem transformar o planejamento em uma obrigação maior que o próprio estudo.</p>' }
    ]
  }
];

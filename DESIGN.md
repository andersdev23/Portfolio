# Anderson Alves — Direção visual

## Conceito

Um caderno pessoal de engenharia, com composição editorial, assinatura tipográfica e diagramas que mostram o raciocínio por trás dos projetos. O conteúdo do autor lidera. A interface usa grafite levemente esverdeado, branco papel e campos verde ácido.

## Sistema

- Fundo #171a17, superfície #1e221e, linhas #363d33.
- Texto principal #f1f2e9; texto secundário #adb3a7; destaque #c1ed78; texto sobre destaque #20291a.
- Manrope para títulos e assinatura; Public Sans para leitura; fonte monoespaçada apenas para código.
- Conteúdo de até 1280px, margens fluidas, divisórias discretas, projetos de escalas diferentes e habilidades em lista.
- Botões e links com foco visível; áreas principais de toque a partir de 44px. Animações respeitam prefers-reduced-motion.

## Página inicial

Modo: Experience. A abertura apresenta o nome do autor e sua fotografia de perfil. A interação principal alterna o retrato por uma apresentação em código. Em telas com mouse, a perspectiva reage levemente ao ponteiro. Entradas usam recorte e deslocamento sem ocultar o conteúdo por padrão. Não há loops de renderização permanentes.

Os três estudos originais mostram dados explicitamente ilustrativos e estado em desenvolvimento. Logspace WMS e Asebyte Digital Signage abrem a seção com representações conceituais próprias e identificação por domínio, sem atribuir tecnologias ou estágio de publicação não confirmados. Nenhuma demonstração ou repositório inexistente é anunciado.

## Foto

A imagem em index.html usa me-profile.jpg, fornecida pelo proprietário, com texto alternativo “Foto de Anderson Alves”. O enquadramento usa object-fit: cover e object-position: center 35%.

## Blog e leitura

Modo: Read. A listagem mantém a identidade em grafite e verde, com abertura compacta, um artigo em maior destaque e cards inteiramente clicáveis por links nativos. As páginas de artigos herdam o cabeçalho, apresentam autor, data e tempo estimado de leitura, e usam uma coluna de até 72 caracteres com corpo de 16–17px. O sumário fica na lateral no desktop e acima do texto no celular. Blocos de código têm rolagem própria, foco visível e não alargam a página. Os novos textos possuem capas vetoriais geométricas locais. Sumário, retorno ao blog e próximas leituras funcionam mesmo sem JavaScript.

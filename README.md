# Portfólio | Anderson Alves


[AcessarPortfólio](https://anderson-alves-portfolio.vercel.app/) 

<div align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-00f5d4?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Portfólio pessoal com direção editorial em grafite e verde ácido, animações interativas e foco em performance, responsividade e código sem dependências.

[Email](mailto:andersonalves.codes@gmail.com) · [LinkedIn](https://www.linkedin.com/in/anderson-a-983170114) · [GitHub](https://github.com/andersdev23) · [WhatsApp](https://wa.me/5541988114903)

</div>

---

## Sobre

Sou **Anderson Alves**, estudante de **Engenharia de Software no 6º semestre**, em busca da primeira oportunidade profissional na área. Este portfólio foi desenvolvido para apresentar minha identidade como desenvolvedor e destacar meu foco em **JavaScript, React, Node.js e MySQL**.

O projeto foi construído com **HTML, CSS e JavaScript puro**, sem frameworks e sem build step, priorizando domínio dos fundamentos da web, experiência visual marcante e facilidade de deploy.

---

## Destaques

- Foto de perfil integrada ao layout, com perspectiva que acompanha o ponteiro
- Botão para alternar entre retrato e uma apresentação em código
- Animações de entrada e interações nos conceitos visuais dos projetos
- Projetos identificados como em desenvolvimento, com prévias ilustrativas
- Logspace WMS e Asebyte Digital Signage em destaque, com representações conceituais
- Menu mobile com suporte a teclado e fechamento com Escape
- Contatos diretos e botão para copiar o e-mail
- Fontes locais, foco visível e respeito a `prefers-reduced-motion`
- Layout responsivo para desktop e mobile; blog com a mesma identidade visual

## Foto de perfil

A apresentação usa `me-profile.jpg`, na raiz do projeto. Inclua esse arquivo junto ao `index.html` no deploy. Para trocar a foto, substitua o arquivo ou atualize o `src` da imagem com a classe `profile-image`.

O enquadramento está em `.profile-image`, no `style.css`, usando `object-fit: cover` e `object-position: center 35%`. O botão “Ver em código” continua alternando a fotografia pela apresentação em JavaScript.

## Links dos projetos em destaque

Os artigos `#logspace-wms` e `#asebyte-digital-signage`, em `index.html`, têm comentários indicando onde adicionar os links de demonstração ou repositório. As tecnologias e o estágio desses dois projetos podem ser acrescentados quando definidos. As prévias atuais são representações conceituais.

## Blog e artigos

O blog possui oito artigos com páginas estáticas individuais em `artigos/`. Clicar na imagem, no título ou em qualquer outra parte de um card abre a página correspondente. Cada artigo inclui sumário, tempo estimado de leitura, link de retorno e sugestões para continuar lendo.

Os três textos adicionados tratam de testes em JavaScript, acessibilidade por teclado e organização de commits no Git. Os exemplos são didáticos e os novos artigos incluem referências oficiais.

Para editar o conteúdo, altere `content/articles.mjs` e execute:

```bash
node scripts/build-blog.mjs
```

O comando atualiza as oito páginas, os cards de `blog.html` e `sitemap.xml`. Os arquivos HTML gerados devem ser incluídos no deploy. O site continua funcionando sem Node.js no servidor e sem JavaScript para abrir e ler os artigos. Edite o conteúdo no arquivo-fonte, pois alterações manuais nos HTMLs dos artigos são substituídas ao gerar novamente.

---

## Stack

- `HTML5`
- `CSS3`
- `JavaScript (ES6+)`
- `IntersectionObserver`
- Fontes variáveis Manrope e Public Sans hospedadas em `assets/fonts`, com licenças OFL incluídas

---

## Estrutura do projeto

```text
portfolio/
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## Como executar localmente

Como o projeto é estático, basta abrir o arquivo `index.html` no navegador. Se preferir rodar com um servidor local:

```bash
python -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

Se estiver usando VS Code, a extensão **Live Server** também funciona bem para desenvolvimento local.

---

## Contato

- Email: `andersonalves.codes@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/anderson-a-983170114`
- GitHub: `https://github.com/andersdev23`
- WhatsApp: `https://wa.me/5541988114903`

---

## Autor

**Anderson Alves**  
Engenharia de Software - 6º semestre  
Disponível para oportunidades, estágio, freelas e projetos colaborativos.

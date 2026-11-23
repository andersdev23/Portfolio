import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { articles, escapeHtml as esc } from '../content/articles.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = 'https://anderson-alves-portfolio.vercel.app';
const modified = '2026-11-22';
const arrow = '<svg class="icon small" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const dateLabel = date => new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
const minutes = article => Math.max(1, Math.ceil((article.intro + article.sections.map(section => section.html).join(' ')).replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length / 200));

const card = (article, index) => `
        <article class="blog-card${index === 0 ? ' featured-post' : ''}" id="post-${article.slug}">
          <a class="post-card-link" href="artigos/${article.slug}.html" aria-labelledby="title-${article.slug}">
            <figure class="post-image"><img src="${esc(article.image)}" alt="${esc(article.imageAlt)}" width="1200" height="720" loading="lazy" decoding="async"></figure>
            <div class="post-card-body">
              <div class="post-meta"><span>${esc(article.category)}</span><time datetime="${article.date}">${dateLabel(article.date)}</time></div>
              <h3 id="title-${article.slug}">${esc(article.title)}</h3>
              <p>${esc(article.description)}</p>
              <span class="post-read-more">Ler artigo <span>${minutes(article)} min de leitura ${arrow}</span></span>
            </div>
          </a>
        </article>`;

const header = `
  <a class="skip-link" href="#main">Pular para o conteúdo</a>
  <header class="site-header"><div class="nav-shell container">
    <a class="nav-logo" href="../index.html" aria-label="Anderson Alves, início">aa<span class="logo-dot">.</span><span class="logo-caption">Anderson Alves</span></a>
    <nav class="main-nav" id="main-nav" aria-label="Navegação principal"><a href="../index.html">Portfólio</a><a href="../blog.html#posts">Artigos</a><a href="../blog.html#topics">Tópicos</a></nav>
    <a class="nav-contact" href="../index.html#contact">Vamos conversar ${arrow}</a>
    <button class="menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="main-nav"><span></span><span></span></button>
  </div></header>`;

const articlePage = (article, index) => {
  const canonical = `${site}/artigos/${article.slug}.html`;
  const related = articles.filter(item => item.slug !== article.slug).sort((a, b) => Number(b.topic === article.topic) - Number(a.topic === article.topic)).slice(0, 2);
  const next = articles[(index + 1) % articles.length];
  const structured = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: article.title, description: article.description, image: `${site}/${article.image}`, datePublished: article.date, dateModified: modified, author: { '@type': 'Person', name: 'Anderson Alves', url: site + '/' }, inLanguage: 'pt-BR', mainEntityOfPage: { '@type': 'WebPage', '@id': canonical } };
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(article.title)} | Anderson Alves</title>
  <meta name="description" content="${esc(article.description)}">
  <meta name="author" content="Anderson Alves">
  <meta name="theme-color" content="#171a17">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${esc(article.title)}">
  <meta property="og:description" content="${esc(article.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${site}/${article.image}">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="../assets/fonts/Manrope-Variable.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="../style.css">
  <link rel="stylesheet" href="../article.css">
  <script type="application/ld+json">${JSON.stringify(structured).replace(/</g, '\\u003c')}</script>
  <script src="../script.js" defer></script>
</head>
<body class="article-page">
${header}
  <main id="main" class="article-main container">
    <nav class="breadcrumbs" aria-label="Caminho de navegação"><a href="../blog.html">Blog</a><span aria-hidden="true">/</span><span>${esc(article.category)}</span></nav>
    <article aria-labelledby="article-title">
      <header class="article-header">
        <h1 id="article-title">${esc(article.title)}</h1>
        <p class="article-intro">${esc(article.intro)}</p>
        <div class="article-meta"><a href="../index.html#about" class="article-author"><span class="author-initials" aria-hidden="true">aa.</span>Anderson Alves</a><time datetime="${article.date}">${dateLabel(article.date)}</time><span>${minutes(article)} min de leitura</span></div>
      </header>
      <figure class="article-cover"><img src="../${esc(article.image)}" alt="${esc(article.imageAlt)}" width="1200" height="720" fetchpriority="high"><figcaption>${esc(article.category)} · Notas de desenvolvimento</figcaption></figure>
      <div class="article-layout">
        <aside class="article-sidebar"><nav class="article-toc" aria-labelledby="contents-title"><h2 id="contents-title">Neste artigo</h2><ol>${article.sections.map(section => `<li><a href="#${section.id}">${esc(section.title)}</a></li>`).join('')}</ol><a class="article-back" href="../blog.html#posts">Voltar para todos os artigos</a></nav></aside>
        <div class="article-body">
${article.sections.map(section => `          <section id="${section.id}" aria-labelledby="heading-${section.id}"><h2 id="heading-${section.id}">${esc(section.title)}</h2>${section.html}</section>`).join('\n')}
${article.references?.length ? `          <section class="article-references" id="referencias" aria-labelledby="references-title"><h2 id="references-title">Referências e próximos passos</h2><p>Documentação oficial para consultar os comportamentos apresentados:</p><ul>${article.references.map(reference => `<li><a href="${esc(reference.url)}" target="_blank" rel="noopener noreferrer">${esc(reference.title)} ${arrow}<span class="sr-only"> (abre em nova aba)</span></a></li>`).join('')}</ul></section>` : ''}
          <div class="article-end"><p>Uma dúvida ou uma ideia a partir desta leitura?</p><a href="mailto:andersonalves.codes@gmail.com?subject=${encodeURIComponent('Sobre o artigo: ' + article.title)}">Vamos conversar ${arrow}</a></div>
        </div>
      </div>
    </article>
    <nav class="article-pagination" aria-label="Navegação entre artigos"><a href="../blog.html#posts">Voltar ao blog</a><a href="${next.slug}.html"><span>Próxima leitura</span>${esc(next.title)} ${arrow}</a></nav>
    <section class="related-section" aria-labelledby="related-title"><h2 id="related-title">Continue a leitura<span class="accent">.</span></h2><div class="related-grid">${related.map(item => `<a href="${item.slug}.html"><span>${esc(item.category)} · ${minutes(item)} min</span><h3>${esc(item.title)}</h3>${arrow}</a>`).join('')}</div></section>
  </main>
  <footer class="site-footer container"><a class="nav-logo" href="../index.html" aria-label="Ir ao portfólio">aa<span class="logo-dot">.</span></a><p>Notas de desenvolvimento por Anderson Alves.</p><span>© <span data-year>2026</span></span><a class="back-to-top" href="#main">Voltar ao início</a></footer>
</body>
</html>
`;
};

await mkdir(path.join(root, 'artigos'), { recursive: true });
for (const [index, article] of articles.entries()) await writeFile(path.join(root, 'artigos', article.slug + '.html'), articlePage(article, index));

let blog = await readFile(path.join(root, 'blog.html'), 'utf8');
const listing = `<!-- BLOG_POSTS_START -->
    <section id="posts" class="blog-section" aria-labelledby="posts-title">
      <div class="blog-list-heading"><h2 id="posts-title" class="section-title">Publicações recentes<span class="accent">.</span></h2><p>${articles.length} artigos para explorar</p></div>
      <div class="blog-grid">${articles.map(card).join('')}
      </div>
    </section>
    <!-- BLOG_POSTS_END -->`;
if (blog.includes('<!-- BLOG_POSTS_START -->')) {
  blog = blog.replace(/<!-- BLOG_POSTS_START -->[\s\S]*?<!-- BLOG_POSTS_END -->/, listing);
} else {
  blog = blog.replace(/<section id="posts" class="blog-section">[\s\S]*?<\/section>/, listing);
}
blog = blog.replace(/\s*<div class="neon-line"><\/div>\s*<section class="blog-section article-list">[\s\S]*?<\/section>/, '');
blog = blog.replace(/<div class="section-label">[^<]*<\/div>\s*/g, '');
blog = blog.replace(/<div class="hero-eyebrow">[^<]*<\/div>\s*/, '');
blog = blog.replace(/<h1 class="hero-name[^>]*>[^<]*<\/h1>/, '<h1 class="hero-name">Blog Tech<span class="accent">.</span></h1>');
blog = blog.replace('Anotacoes praticas sobre desenvolvimento web, JavaScript, arquitetura, carreira em tecnologia e estudos de Engenharia de Software.', 'Notas sobre código, decisões de desenvolvimento e o que vale compartilhar pelo caminho. JavaScript, interfaces e engenharia de software na prática.');
blog = blog.replace('Voltar ao portfolio', 'Voltar ao portfólio').replace('Categorias do blog', 'Explore por assunto').replace('Tem uma ideia de artigo?', 'Tem uma ideia de artigo?').replace('Me envie uma sugestao de tema, duvida tecnica ou oportunidade de colaboracao.', 'Me envie uma sugestão de tema, dúvida técnica ou oportunidade de colaboração.').replace('Enviar sugestao', 'Enviar sugestão').replace('boas praticas.', 'boas práticas.').replace('experiencia do usuario.', 'experiência do usuário.').replace('autenticacao e arquitetura.', 'autenticação e arquitetura.');
const topicMap = { JavaScript: 'javascript', 'Front-end': 'frontend', 'Back-end': 'backend', Dados: 'dados' };
blog = blog.replace(/<a class="topic-card" href="(?:#posts|#post-[^"]+)">([\s\S]*?)<\/a>/g, (match, inside) => {
  const name = inside.match(/<strong>([^<]+)<\/strong>/)?.[1];
  const article = articles.find(item => item.topic === topicMap[name]);
  return article ? `<a class="topic-card" href="#post-${article.slug}">${inside}</a>` : match;
});
blog = blog.replace('<title>Blog | Tecnologia</title>', '<title>Blog Tech — Artigos sobre desenvolvimento | Anderson Alves</title>');
if (!blog.includes('name="description"')) blog = blog.replace('  <meta name="theme-color"', '  <meta name="description" content="Artigos de Anderson Alves sobre JavaScript, testes, acessibilidade, Git, React, APIs e banco de dados.">\n  <link rel="canonical" href="' + site + '/blog.html">\n  <meta name="theme-color"');
await writeFile(path.join(root, 'blog.html'), blog);
const urls = [site + '/', site + '/blog.html', ...articles.map(article => `${site}/artigos/${article.slug}.html`)];
await writeFile(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${url}</loc><lastmod>${modified}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`Blog atualizado: ${articles.length} páginas de artigos e sitemap gerados.`);

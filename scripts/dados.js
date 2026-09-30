const ICONE = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/";

export const textos = {
  pt: {
    "portal.sub": "Desenvolvedor Full Stack",
    "portal.som": "Entrar com som",
    "portal.silencio": "Entrar em silêncio",
    "portal.dica": "Recomendo usar fones. Arraste o cursor rápido para cortar as folhas.",
    "nav.inicio": "Início",
    "nav.caminho": "Sobre",
    "nav.arsenal": "Stack",
    "nav.batalhas": "Projetos",
    "nav.codigo": "Princípios",
    "nav.contato": "Contato",
    "heroi.sobre": "Santa Catarina · Brasil",
    "heroi.cargo": "Desenvolvedor Full Stack",
    "heroi.lema": "Quem conhece o caminho por inteiro o enxerga em todas as coisas.",
    "heroi.fonte": "Miyamoto Musashi, adaptado",
    "heroi.cta": "Conhecer meu trabalho",
    "heroi.iai": "Desembainhar",
    "heroi.dica": "clique no Musashi",
    "heroi.rolar": "role",
    "caminho.rotulo": "Dō · Sobre",
    "caminho.titulo": "Sobre mim",
    "caminho.p1": "Sou desenvolvedor full stack. Trabalho com a construção, a arquitetura e a evolução de aplicações web corporativas e sistemas distribuídos, principalmente APIs RESTful, plataformas SaaS multi-tenant e automações com inteligência artificial.",
    "caminho.p2": "Gosto de código simples de ler e fácil de manter. Uso Clean Code, SOLID e Clean Architecture no dia a dia e dou atenção especial a segurança, performance e escalabilidade.",
    "caminho.p3": "Atuo no ciclo completo: modelagem de dados, APIs, interfaces, containers, orquestração com Kubernetes e pipelines de CI/CD na AWS e na Azure, em times ágeis com cultura DevOps.",
    "ficha.local": "Base",
    "ficha.local.v": "Santa Catarina, Brasil",
    "ficha.foco": "Foco",
    "ficha.foco.v": "APIs, SaaS, microsserviços e IA aplicada",
    "ficha.formacao": "Formação",
    "ficha.formacao.v": "Análise e Desenvolvimento de Sistemas",
    "ficha.idiomas": "Idiomas",
    "ficha.idiomas.v": "Português nativo · Inglês avançado · Espanhol intermediário",
    "ficha.cultura": "Cultura",
    "ficha.cultura.v": "Ágil, DevOps e entrega contínua",
    "arsenal.rotulo": "Katana · Stack",
    "arsenal.titulo": "Minha stack",
    "arsenal.intro": "Tecnologias que uso no dia a dia, do backend à nuvem.",
    "batalhas.rotulo": "Tatakai · Projetos",
    "batalhas.titulo": "Projetos",
    "batalhas.intro": "A maior parte do meu trabalho fica em repositórios privados de clientes e empresas, então aqui estão resumos do que construí.",
    "batalhas.fechado": "privado · resumo",
    "batalhas.publicos": "Repositórios públicos",
    "codigo.rotulo": "Kokoro · Princípios",
    "codigo.titulo": "Como eu trabalho",
    "codigo.intro": "As sete virtudes do bushidō como guia para as decisões técnicas.",
    "contato.rotulo": "En · Contato",
    "contato.titulo": "Vamos conversar",
    "contato.intro": "Estou aberto a conversas sobre projetos, oportunidades e arquitetura de software.",
    "rodape.texto": "Música gerada em tempo real no navegador."
  },
  en: {
    "portal.sub": "Full Stack Developer",
    "portal.som": "Enter with sound",
    "portal.silencio": "Enter in silence",
    "portal.dica": "Headphones recommended. Drag the cursor fast to slash the leaves.",
    "nav.inicio": "Home",
    "nav.caminho": "About",
    "nav.arsenal": "Stack",
    "nav.batalhas": "Projects",
    "nav.codigo": "Principles",
    "nav.contato": "Contact",
    "heroi.sobre": "Santa Catarina · Brazil",
    "heroi.cargo": "Full Stack Developer",
    "heroi.lema": "Whoever truly knows the Way sees it in all things.",
    "heroi.fonte": "Miyamoto Musashi, adapted",
    "heroi.cta": "See my work",
    "heroi.iai": "Draw the blade",
    "heroi.dica": "click Musashi",
    "heroi.rolar": "scroll",
    "caminho.rotulo": "Dō · About",
    "caminho.titulo": "About me",
    "caminho.p1": "Full stack developer. I build, architect and evolve enterprise web applications and distributed systems, mainly RESTful APIs, multi-tenant SaaS platforms and AI-driven automation.",
    "caminho.p2": "I like code that is easy to read and maintain. I apply Clean Code, SOLID and Clean Architecture daily and pay close attention to security, performance and scalability.",
    "caminho.p3": "I work across the whole cycle: data modeling, APIs, interfaces, containers, Kubernetes orchestration and CI/CD pipelines on AWS and Azure, in agile teams with a DevOps culture.",
    "ficha.local": "Based in",
    "ficha.local.v": "Santa Catarina, Brazil",
    "ficha.foco": "Focus",
    "ficha.foco.v": "APIs, SaaS, microservices and applied AI",
    "ficha.formacao": "Education",
    "ficha.formacao.v": "Systems Analysis and Development",
    "ficha.idiomas": "Languages",
    "ficha.idiomas.v": "Portuguese native · English advanced · Spanish intermediate",
    "ficha.cultura": "Culture",
    "ficha.cultura.v": "Agile, DevOps and continuous delivery",
    "arsenal.rotulo": "Katana · Stack",
    "arsenal.titulo": "My stack",
    "arsenal.intro": "Technologies I use every day, from backend to cloud.",
    "batalhas.rotulo": "Tatakai · Projects",
    "batalhas.titulo": "Projects",
    "batalhas.intro": "Most of my work lives in private repositories owned by clients and companies, so here are summaries of what I built.",
    "batalhas.fechado": "private · summary",
    "batalhas.publicos": "Public repositories",
    "codigo.rotulo": "Kokoro · Principles",
    "codigo.titulo": "How I work",
    "codigo.intro": "The seven virtues of bushidō as a guide for technical decisions.",
    "contato.rotulo": "En · Contact",
    "contato.titulo": "Let's talk",
    "contato.intro": "Open to conversations about projects, opportunities and software architecture.",
    "rodape.texto": "Music generated in real time in your browser."
  }
};

export const fichas = ["local", "foco", "formacao", "idiomas", "cultura"];

export const arsenal = [
  {
    kanji: "裏", titulo: { pt: "Backend", en: "Backend" }, sub: { pt: "APIs e serviços", en: "APIs and services" },
    itens: [
      ["Node.js", "nodejs/nodejs-original"], ["NestJS", "nestjs/nestjs-original"], ["TypeScript", "typescript/typescript-original"],
      ["C#", "csharp/csharp-original"], [".NET", "dotnetcore/dotnetcore-original"], ["Express", "express/express-original"],
      ["Go", "go/go-original-wordmark"], ["Python", "python/python-original"]
    ]
  },
  {
    kanji: "表", titulo: { pt: "Frontend", en: "Frontend" }, sub: { pt: "interfaces", en: "interfaces" },
    itens: [
      ["React", "react/react-original"], ["Next.js", "nextjs/nextjs-original"], ["Vue.js", "vuejs/vuejs-original"],
      ["JavaScript", "javascript/javascript-original"], ["HTML5", "html5/html5-original"], ["CSS3", "css3/css3-original"],
      ["Tailwind", "tailwindcss/tailwindcss-original"]
    ]
  },
  {
    kanji: "蔵", titulo: { pt: "Dados", en: "Data" }, sub: { pt: "persistência", en: "persistence" },
    itens: [
      ["PostgreSQL", "postgresql/postgresql-original"], ["MySQL", "mysql/mysql-original"], ["MongoDB", "mongodb/mongodb-original"],
      ["TypeORM", null], ["Prisma", "prisma/prisma-original"]
    ]
  },
  {
    kanji: "雲", titulo: { pt: "Cloud & DevOps", en: "Cloud & DevOps" }, sub: { pt: "infra e entrega", en: "infra and delivery" },
    itens: [
      ["AWS", "amazonwebservices/amazonwebservices-original-wordmark"], ["Azure", "azure/azure-original"], ["Docker", "docker/docker-original"],
      ["Kubernetes", "kubernetes/kubernetes-original"], ["Jenkins", "jenkins/jenkins-original"], ["Git", "git/git-original"],
      ["GitHub", "github/github-original"], ["Jira", "jira/jira-original"]
    ]
  },
  {
    kanji: "智", titulo: { pt: "Inteligência Artificial", en: "Artificial Intelligence" }, sub: { pt: "LLMs e automação", en: "LLMs and automation" },
    itens: [
      ["Azure AI", "azure/azure-original"], ["OpenAI", null], ["Gemini", null], ["DeepSeek", null], ["LLM Agents", null], ["n8n", null]
    ]
  }
];

export const conceitos = {
  pt: ["Microsserviços", "Clean Architecture", "SOLID", "RESTful APIs", "SaaS multi-tenant", "CI/CD", "ETL", "Sistemas distribuídos"],
  en: ["Microservices", "Clean Architecture", "SOLID", "RESTful APIs", "Multi-tenant SaaS", "CI/CD", "ETL", "Distributed systems"]
};

export const batalhas = [
  {
    num: "一",
    titulo: { pt: "SaaS E-commerce Multi-Tenant", en: "Multi-Tenant E-commerce SaaS" },
    texto: {
      pt: "Plataforma completa de e-commerce com isolamento lógico de dados por cliente, checkout, controle de estoque, autenticação social e automações via API do WhatsApp.",
      en: "A complete e-commerce platform with logical data isolation per tenant, checkout, inventory control, social login and WhatsApp API automations."
    },
    etiquetas: ["TypeScript", "Multi-tenant", "Checkout", "OAuth", "WhatsApp API"]
  },
  {
    num: "二",
    titulo: { pt: "Classificação de chamados com IA", en: "AI Ticket Classification" },
    texto: {
      pt: "Microsserviço desacoplado integrado a LLMs (OpenAI, Gemini e DeepSeek) que classifica chamados automaticamente a partir do contexto de cada atendimento.",
      en: "A decoupled microservice integrated with LLMs (OpenAI, Gemini and DeepSeek) that classifies support tickets automatically based on each request's context."
    },
    etiquetas: ["TypeScript", "LLMs", "Microsserviço", "Prompt engineering"]
  },
  {
    num: "三",
    titulo: { pt: "Sincronização Movidesk e Jira", en: "Movidesk and Jira Sync" },
    texto: {
      pt: "Serviço de sincronização bidirecional em tempo real entre help desk e gestão de projetos, que eliminou processos manuais e reduziu o retrabalho entre as equipes de suporte e desenvolvimento.",
      en: "A real-time bidirectional sync service between help desk and project management that removed manual steps and reduced rework between the support and development teams."
    },
    etiquetas: ["Node.js", "Webhooks", "Tempo real", "Jira API"]
  },
  {
    num: "四",
    titulo: { pt: "Sincronizador de dados para BI", en: "BI Data Synchronizer" },
    texto: {
      pt: "Serviço em C#/.NET com rotinas ETL entre ERPs locais e APIs analíticas, alimentando dashboards personalizados no Power BI.",
      en: "A C#/.NET service running ETL routines between on-premise ERPs and analytics APIs, feeding custom Power BI dashboards."
    },
    etiquetas: ["C#", ".NET", "ETL", "Power BI"]
  }
];

export const publicos = [
  { nome: "celeirobarber", linguagem: "Next.js · Express · Prisma", texto: { pt: "Agendamento e gestão de barbearias com login Google e painel administrativo.", en: "Barbershop scheduling and management with Google login and admin panel." } },
  { nome: "recicla-entulhos", linguagem: "TypeScript", texto: { pt: "Gestão de caçambas e locações.", en: "Dumpster and rental management." } },
  { nome: "ph24", linguagem: "JavaScript · IA", texto: { pt: "Interpretação de receitas médicas por IA com saída JSON e webhook.", en: "AI interpretation of medical prescriptions with JSON output and webhook." } },
  { nome: "Amazon-Aliexpress-Price-Monitor", linguagem: "Python", texto: { pt: "Bot de monitoramento de preços na Amazon e AliExpress.", en: "Price monitoring bot for Amazon and AliExpress." } },
  { nome: "Code-Reader-And-Converter", linguagem: "Python", texto: { pt: "Lê código a partir de uma imagem e converte direto.", en: "Scans code from an image and converts it." } },
  { nome: "Tweets-Updates-Bot", linguagem: "Python", texto: { pt: "Encaminha tweets de um usuário para o Telegram.", en: "Forwards a user's tweets to Telegram." } }
];

export const virtudes = [
  { kanji: "義", nome: "Gi", virtude: { pt: "Retidão", en: "Rectitude" }, titulo: { pt: "Código limpo", en: "Clean code" }, texto: { pt: "Nomes claros, funções pequenas e uma responsabilidade por vez. SOLID e Clean Architecture aplicados com bom senso.", en: "Clear names, small functions and one responsibility at a time. SOLID and Clean Architecture applied with judgment." } },
  { kanji: "勇", nome: "Yū", virtude: { pt: "Coragem", en: "Courage" }, titulo: { pt: "Problemas em produção", en: "Production issues" }, texto: { pt: "Incidentes críticos resolvidos com calma e método, e refatoração quando ela é necessária.", en: "Critical incidents handled with calm and method, and refactoring when it is needed." } },
  { kanji: "仁", nome: "Jin", virtude: { pt: "Benevolência", en: "Benevolence" }, titulo: { pt: "Pensar em quem mantém", en: "Care for maintainers" }, texto: { pt: "Código é lido muito mais vezes do que escrito, então escrevo pensando em quem vai dar manutenção.", en: "Code is read far more often than it is written, so I write with the next maintainer in mind." } },
  { kanji: "礼", nome: "Rei", virtude: { pt: "Respeito", en: "Respect" }, titulo: { pt: "Respeito ao usuário", en: "Respect for the user" }, texto: { pt: "Interfaces rápidas e acessíveis, com baixa latência e boa experiência de uso.", en: "Fast, accessible interfaces with low latency and a good user experience." } },
  { kanji: "誠", nome: "Makoto", virtude: { pt: "Honestidade", en: "Honesty" }, titulo: { pt: "Medir antes de otimizar", en: "Measure before optimizing" }, texto: { pt: "Observabilidade, testes e métricas reais antes de qualquer otimização.", en: "Observability, tests and real metrics before any optimization." } },
  { kanji: "名誉", nome: "Meiyo", virtude: { pt: "Honra", en: "Honor" }, titulo: { pt: "Segurança em primeiro lugar", en: "Security first" }, texto: { pt: "Validação de toda entrada, menor privilégio e nenhuma confiança cega no cliente.", en: "Validate every input, apply least privilege and never blindly trust the client." } },
  { kanji: "忠義", nome: "Chūgi", virtude: { pt: "Lealdade", en: "Loyalty" }, titulo: { pt: "Entrega contínua", en: "Continuous delivery" }, texto: { pt: "Pipelines de CI/CD, containers e orquestração para entregar com frequência e segurança.", en: "CI/CD pipelines, containers and orchestration to ship often and safely." } }
];

export const urlIcone = (caminho) => `${ICONE}${caminho}.svg`;

# 🎬 MovieSearch - Premium Movie Discovery

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SASS](https://img.shields.io/badge/SASS-hotpink?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)
[![TMDB](https://img.shields.io/badge/TMDB-01d277?style=for-the-badge&logo=the-movie-database&logoColor=white)](https://www.themoviedb.org/)

**MovieSearch** é uma plataforma de descoberta de filmes moderna e imersiva, focada na experiência do usuário. Usando a robusta API do TMDB, o projeto oferece informações completas, trailers, locais de exibição e muito mais.

---

## ✨ Principais Funcionalidades

-   **🔍 Busca Inteligente:** Pesquisa instantânea com sugestões em tempo real.
-   **📽️ Detalhes Completos:** Sinopse, gêneros, orçamento, bilheteria e trailers integrados via YouTube.
-   **🍿 Onde Assistir:** Integração com o JustWatch (via TMDB) para mostrar onde os filmes estão disponíveis para streaming, aluguel ou compra.
-   **👥 Elenco e Equipe:** Página dedicada com a lista completa do elenco e equipe técnica, agrupada por departamentos (Direção, Roteiro, Arte, etc.).
-   **👤 Perfil de Atores:** Biografia completa e filmografia detalhada de cada profissional.
-   **⭐ Sistema de Favoritos:** Salve filmes na sua **Minha Lista** para assistir mais tarde, com persistência no navegador.
-   **💡 Recomendações:** Sugestões de títulos baseadas no filme que você está visualizando.
-   **📱 Totalmente Responsivo:** Design otimizado para celulares, tablets e desktops.

---

## 🛠️ Tecnologias Utilizadas

-   **Frontend:** [React.js](https://reactjs.org/) (Hooks & Context API)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Bundler:** [Vite](https://vitejs.dev/)
-   **Estilização:** [SCSS/SASS](https://sass-lang.com/) (com Mixins e Variáveis)
-   **Ícones:** [Lucide-React](https://lucide.dev/)
-   **Requisições:** [Axios](https://axios-http.com/)
-   **Roteamento:** [React Router Dom](https://reactrouter.com/)
-   **API:** [themoviedb.org](https://www.themoviedb.org/)

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar o projeto localmente:

### 1. Pré-requisitos
-   [Node.js](https://nodejs.org/) instalado (recomenda-se v18 ou superior).
-   Uma chave de API do [TMDB](https://www.themoviedb.org/documentation/api).

### 2. Clonar o Repositório
```bash
git clone https://github.com/ovmf18/MovieSearch.git
cd MovieSearch
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto e adicione sua chave do TMDB:
```env
VITE_TMDB_API_KEY=sua_chave_aqui
```
*(Nota: Use o `.env.example` como referência).*

### 5. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
O projeto estará disponível no seu navegador em `http://localhost:5173`.

---

## 📦 Estrutura de Pastas

```text
src/
├── components/   # Componentes reutilizáveis (Hero, Navbar, Footer, MovieCard, Skeletons)
├── context/      # Gerenciamento de estado global (Watchlist Context)
├── pages/        # Telas da aplicação (Home, MovieDetails, MovieCredits, PersonDetails, etc.)
├── services/     # Integração com a API (Axios config e MovieService)
├── styles/       # Variáveis globais e mixins de estilo
└── App.tsx       # Roteamento e estrutura principal
```

---

## 📜 Licença e Créditos

Este projeto foi desenvolvido por **Osmar Valporto Moreno Filho**.

Agradecimentos ao [The Movie Database (TMDB)](https://www.themoviedb.org/) pelo fornecimento da API gratuita de filmes. Este projeto usa a API do TMDB mas não é endossado ou certificado pelo TMDB.

---
*Desenvolvido como um projeto de busca e descoberta cinematográfica com foco em UI/UX.*

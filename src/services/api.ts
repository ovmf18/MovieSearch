import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'pt-BR',
  },
});

export const movieService = {
  // Pega os filmes mais populares no Brasil no momento (Em Alta)
  getTrending: async () => {
    const response = await api.get('/discover/movie', {
      params: { 
        region: 'BR',
        sort_by: 'popularity.desc'
      }
    });
    return response.data.results;
  },
  
  // Pega os próximos lançamentos NO BRASIL (com suporte a paginação)
  getUpcoming: async (page: number = 1) => {
    const response = await api.get('/movie/upcoming', {
      params: { 
        region: 'BR',
        page: page 
      }
    });
    return response.data; // Retornamos o objeto completo agora (results, pages, etc)
  },

  // Pega os filmes mais bem avaliados (Filtrado por região para maior precisão)
  getTopRated: async () => {
    const response = await api.get('/movie/top_rated', {
      params: { region: 'BR' }
    });
    return response.data.results;
  },

  // Busca detalhes completos de um filme específico
  getMovieDetails: async (id: string | number) => {
    const response = await api.get(`/movie/${id}`, {
      params: { 
        append_to_response: 'videos,credits,release_dates,images,watch/providers',
        include_image_language: 'pt,en,null'
      }
    });
    return response.data;
  },

  // Busca as datas de lançamento separadamente se necessário
  getReleaseDates: async (id: string | number) => {
    const response = await api.get(`/movie/${id}/release_dates`);
    return response.data.results;
  },

  // Realiza a busca de filmes por texto
  searchMovies: async (query: string) => {
    const response = await api.get('/search/movie', {
      params: { query },
    });
    return response.data.results;
  },

};

export default api;

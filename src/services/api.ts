import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'pt-BR',
  },
});

export const movieService = {
  // Pega os filmes que estão em alta na semana
  getTrending: async () => {
    const response = await api.get('/trending/movie/week');
    return response.data.results;
  },
  
  // Pega os próximos lançamentos
  getUpcoming: async () => {
    const response = await api.get('/movie/upcoming', {
      params: { region: 'BR' } // Foca em lançamentos no Brasil
    });
    return response.data.results;
  },

  // Pega os filmes mais bem avaliados da história
  getTopRated: async () => {
    const response = await api.get('/movie/top_rated');
    return response.data.results;
  },

  // Busca detalhes completos de um filme específico
  getMovieDetails: async (id: string | number) => {
    const response = await api.get(`/movie/${id}`, {
      params: { append_to_response: 'videos,credits,release_dates' }
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

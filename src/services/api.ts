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
  
  // Realiza a busca de filmes por texto
  searchMovies: async (query: string) => {
    const response = await api.get('/search/movie', {
      params: { query },
    });
    return response.data.results;
  },
  
  // Pega detalhes de um filme específico (incluindo datas de lançamento no Brasil)
  getMovieDetails: async (id: number) => {
    const response = await api.get(`/movie/${id}`, {
      params: { append_to_response: 'release_dates,credits' },
    });
    return response.data;
  },

};

export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: 'pt-BR',
  },
});

export const movieService = {
  // Pega os filmes populares no Brasil (suporta paginação para a nova página)
  getTrending: async (page: number = 1) => {
    const response = await api.get('/discover/movie', {
      params: { 
        region: 'BR',
        sort_by: 'popularity.desc',
        page: page
      }
    });
    return response.data;
  },
  
  getUpcoming: async (page: number = 1) => {
    const response = await api.get('/movie/upcoming', {
      params: { 
        region: 'BR',
        page: page 
      }
    });
    return response.data; 
  },

  // Pega os filmes mais bem avaliados (com paginação)
  getTopRated: async (page: number = 1) => {
    const response = await api.get('/movie/top_rated', {
      params: { 
        region: 'BR',
        page: page
      }
    });
    return response.data;
  },

  getMovieDetails: async (id: string | number) => {
    const response = await api.get(`/movie/${id}`, {
      params: { 
        append_to_response: 'videos,credits,release_dates,images,watch/providers',
        include_image_language: 'pt,en,null'
      }
    });
    return response.data;
  },

  getReleaseDates: async (id: string | number) => {
    const response = await api.get(`/movie/${id}/release_dates`);
    return response.data.results;
  },
  searchMovies: async (query: string) => {
    const response = await api.get('/search/movie', {
      params: { query },
    });
    return response.data.results;
  },

  getSimilarMovies: async (id: string | number) => {
    const response = await api.get(`/movie/${id}/similar`, {
      params: { 
        language: 'pt-BR',
        page: 1
      }
    });
    return response.data;
  },

  getPersonDetails: async (id: string | number) => {
    const response = await api.get(`/person/${id}`, {
      params: { language: 'pt-BR' }
    });
    return response.data;
  },

  getPersonMovieCredits: async (id: string | number) => {
    const response = await api.get(`/person/${id}/movie_credits`, {
      params: { language: 'pt-BR' }
    });
    return response.data;
  },


};

export default api;

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

  getTopRated: async () => {
    const response = await api.get('/movie/top_rated', {
      params: { region: 'BR' }
    });
    return response.data.results;
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

};

export default api;

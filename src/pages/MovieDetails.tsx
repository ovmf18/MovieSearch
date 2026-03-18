import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Star, Play, ImageOff, X } from 'lucide-react';
import { movieService } from '../services/api';
import './MovieDetails.scss';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  runtime: number;
  tagline: string;
  original_title: string;
  original_language: string;
  budget: number;
  revenue: number;

  vote_average: number;
  genres: { id: number; name: string }[];
  release_dates: {
    results: {
      iso_3166_1: string;
      release_dates: { release_date: string; type: number; certification: string }[];
    }[];
  };
  credits: {
    cast: { id: number; name: string; character: string; profile_path: string }[];
    crew: { id: number; name: string; job: string }[];
  };
  videos?: {
    results: { id: string; key: string; name: string; site: string; type: string }[];
  };
  "watch/providers"?: {
    results: {
      [key: string]: {
        link: string;
        flatrate?: { logo_path: string; provider_id: number; provider_name: string }[];
        buy?: { logo_path: string; provider_id: number; provider_name: string }[];
        rent?: { logo_path: string; provider_id: number; provider_name: string }[];
      };
    };
  };
  images?: {
    logos: { file_path: string }[];
  };
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const data = await movieService.getMovieDetails(id);
        setMovie(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="loading-screen">Carregando detalhes...</div>;
  if (!movie) return <div className="error-screen">Filme não encontrado.</div>;

  // Encontrar a data de lançamento e classificação no Brasil
  const brRelease = movie.release_dates.results.find(r => r.iso_3166_1 === 'BR');
  const certification = brRelease?.release_dates.find(rd => rd.certification !== '')?.certification || '?';
  const brDate = brRelease
    ? new Date(brRelease.release_dates[0].release_date).toLocaleDateString('pt-BR')
    : new Date(movie.release_date).toLocaleDateString('pt-BR');

  const directors = movie.credits.crew.filter(person => person.job === 'Director');
  const writers = movie.credits.crew.filter(person => person.job === 'Screenplay' || person.job === 'Writer');

  const trailer = movie.videos?.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer') ||
    movie.videos?.results.find(vid => vid.site === 'YouTube' && vid.type === 'Teaser');

  const backgroundUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null;

  const watchProviders = movie['watch/providers']?.results['BR'];
  const streamingProviders = watchProviders?.flatrate || [];

  const rentOrBuyProviders = [...(watchProviders?.rent || []), ...(watchProviders?.buy || [])]
    .filter((v, i, a) => a.findIndex(t => (t.provider_id === v.provider_id)) === i);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    if (!amount || amount === 0) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  };

  const formatLanguage = (lang: string) => {
    try {
      const languageNames = new Intl.DisplayNames(['pt-BR'], { type: 'language' });
      const name = languageNames.of(lang);
      return name ? name.charAt(0).toUpperCase() + name.slice(1) : lang;
    } catch {
      return lang.toUpperCase();
    }
  };

  return (
    <div className="movie-details-page">
      <div
        className="backdrop-container"
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : { backgroundColor: '#0f1014' }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <div className="details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} /> Voltar
        </button>

        <div className="main-info">
          <div className="poster-side">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} className="detail-poster" />
            ) : (
              <div className="detail-poster missing">
                <ImageOff size={80} />
                <span>Pôster indisponível</span>
              </div>
            )}

            {(streamingProviders.length > 0 || rentOrBuyProviders.length > 0) && (
              <div className="watch-providers-section">
                <h3>Onde Assistir</h3>
                <div className="providers-container">
                  {streamingProviders.length > 0 && (
                    <div className="provider-group">
                      <span>Streaming</span>
                      <div className="provider-list">
                        {streamingProviders.map(provider => (
                          <img
                            key={provider.provider_id}
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                            className="provider-logo"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {rentOrBuyProviders.length > 0 && (
                    <div className="provider-group">
                      <span>Alugar / Comprar</span>
                      <div className="provider-list">
                        {rentOrBuyProviders.map(provider => (
                          <img
                            key={`rent-buy-${provider.provider_id}`}
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            title={provider.provider_name}
                            className="provider-logo"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="side-info-section">
              <h3>Informações</h3>
              <div className="info-list">
                <div className="info-item-block">
                  <span className="info-label">Título Original</span>
                  <span className="info-value">{movie.original_title}</span>
                </div>
                <div className="info-item-block">
                  <span className="info-label">Idioma Original</span>
                  <span className="info-value">{formatLanguage(movie.original_language)}</span>
                </div>
                <div className="info-item-block">
                  <span className="info-label">Orçamento</span>
                  <span className="info-value">{formatCurrency(movie.budget)}</span>
                </div>
                <div className="info-item-block">
                  <span className="info-label">Bilheteria</span>
                  <span className="info-value">{formatCurrency(movie.revenue)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="content-side">
            <h1 className="movie-title">
              {movie.title} <span>({new Date(movie.release_date).getFullYear()})</span>
            </h1>

            {movie.tagline && <p className="tagline">"{movie.tagline}"</p>}

            <div className="meta-info">
              <span className={`certification ${certification === '?' ? 'cert-unknown' : `cert-${certification.toLowerCase()}`}`}>
                {certification}
              </span>
              <span className="info-item"><Calendar size={18} /> {brDate} (BR)</span>
              <span className="dot">•</span>
              <span className="info-item">
                {movie.genres.map(g => g.name).join(', ')}
              </span>
              <span className="dot">•</span>
              <span className="info-item"><Clock size={18} /> {formatRuntime(movie.runtime)}</span>
            </div>

            <div className="rating-section">
              <div className={`score-badge ${(() => {
                const r = movie.vote_average;
                if (r === 0) return 'none';
                if (r >= 7) return 'high';
                if (r >= 4) return 'mid';
                return 'low';
              })()}`}>
                <Star size={20} fill="currentColor" />
                {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : 'N/A'}
              </div>
              <span className="vote-label">Avaliação dos Usuários</span>

              {trailer && (
                <button className="trailer-btn" onClick={() => setShowTrailer(true)}>
                  <Play size={20} fill="currentColor" /> Assista ao Trailer
                </button>
              )}
            </div>

            <div className="overview-section">
              <h3>Sinopse</h3>
              <p>{movie.overview || "Nenhuma sinopse disponível."}</p>
            </div>

            <div className="crew-info">
              {directors.length > 0 && (
                <div className="crew-item">
                  <strong>Direção</strong>
                  <p>{directors.map(d => d.name).join(', ')}</p>
                </div>
              )}
              {writers.length > 0 && (
                <div className="crew-item">
                  <strong>Roteiro</strong>
                  <p>{writers.map(w => w.name).join(', ')}</p>
                </div>
              )}
            </div>

            <div className="cast-section">
              <h3>Elenco Principal</h3>
              <div className="cast-list">
                {movie.credits.cast.slice(0, 6).map(person => (
                  <div key={person.id} className="cast-card">
                    <div className="cast-img-wrapper">
                      {person.profile_path ? (
                        <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} />
                      ) : (
                        <div className="no-img">?</div>
                      )}
                    </div>
                    <p className="actor-name">{person.name}</p>
                    <p className="char-name">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTrailer && trailer && (
        <div className="trailer-modal">
          <div className="modal-overlay" onClick={() => setShowTrailer(false)}></div>
          <div className="modal-content">
            <h2 className="modal-title">Trailer</h2>
            <button className="close-modal" onClick={() => setShowTrailer(false)}>
              <X size={24} />
            </button>
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0`}
                title="Trailer do Filme"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;

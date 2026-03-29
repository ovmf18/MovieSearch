import { useEffect, useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { movieService } from '../services/api'
import MovieCard from '../components/MovieCard'
import Hero from '../components/Hero'
import SkeletonCard from '../components/SkeletonCard'
import './Home.scss'

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

// Tipo específico para as seções de scroll
type ScrollSection = 'trending' | 'upcoming' | 'topRated';

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])
  const [randomBackdrop, setRandomBackdrop] = useState<string>('')
  const [loading, setLoading] = useState(true)

  // Refs para controlar o scroll de cada lista
  const trendingRef = useRef<HTMLDivElement>(null)
  const upcomingRef = useRef<HTMLDivElement>(null)
  const topRatedRef = useRef<HTMLDivElement>(null)

  // Estado inicializado com todos os campos necessários para evitar undefined
  const [scrollStates, setScrollStates] = useState<Record<ScrollSection, { left: boolean; right: boolean }>>({
    trending: { left: false, right: false },
    upcoming: { left: false, right: false },
    topRated: { left: false, right: false },
  });

  // Função de verificação de scroll com useCallback para evitar re-criações desnecessárias
  const checkScroll = useCallback((ref: React.RefObject<HTMLDivElement | null>, key: ScrollSection) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      setScrollStates(prev => ({
        ...prev,
        [key]: {
          left: scrollLeft > 5,
          right: scrollWidth > clientWidth + scrollLeft + 5
        }
      }));
    }
  }, []);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const [trendingRes, upcomingRes, topRatedRes] = await Promise.all([
          movieService.getTrending(),
          movieService.getUpcoming(),
          movieService.getTopRated()
        ])

        setTrendingMovies(trendingRes.results)
        setUpcomingMovies(upcomingRes.results)
        setTopRatedMovies(topRatedRes.results)

        if (trendingRes.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * trendingRes.results.length);
          setRandomBackdrop(trendingRes.results[randomIndex].backdrop_path);
        }
      } catch (error) {
        console.error("Erro ao buscar filmes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMovies()
    document.title = "Explore o Cinema | MovieSearch"
    window.scrollTo(0, 0)
  }, [])

  // Efeito secundário para checar o scroll assim que o carregamento termina
  useEffect(() => {
    if (!loading) {
      // Pequeno timeout para garantir que o DOM renderizou os cartões
      const timer = setTimeout(() => {
        checkScroll(trendingRef, 'trending');
        checkScroll(upcomingRef, 'upcoming');
        checkScroll(topRatedRef, 'topRated');
      }, 300);
      
      const handleResize = () => {
        checkScroll(trendingRef, 'trending');
        checkScroll(upcomingRef, 'upcoming');
        checkScroll(topRatedRef, 'topRated');
      };

      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [loading, checkScroll]);

  const handleScrollAction = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right', key: ScrollSection) => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;

      ref.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
      
      // Atualizar estado após o scroll (behavior smooth demora um pouco)
      setTimeout(() => checkScroll(ref, key), 500);
    }
  }

  const renderSection = (title: string, subtitle: string, movies: Movie[], scrollRef: React.RefObject<HTMLDivElement | null>, key: ScrollSection, linkTo: string) => {
    const state = scrollStates[key];
    
    return (
      <section className="home-section">
        <div className="section-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="list-wrapper">
          <button
            className={`scroll-button left ${state.left ? 'visible' : ''}`}
            onClick={() => handleScrollAction(scrollRef, 'left', key)}
            aria-label="Rolar para esquerda"
            disabled={!state.left}
          >
            <ChevronLeft size={32} />
          </button>

          <div 
            className="horizontal-list" 
            ref={scrollRef}
            onScroll={() => checkScroll(scrollRef, key)}
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={`skeleton-${idx}`} />
              ))
            ) : (
              <>
                {movies.map(movie => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    posterPath={movie.poster_path}
                    releaseDate={movie.release_date}
                    voteAverage={movie.vote_average}
                  />
                ))}
                <Link to={linkTo} className="show-more-link">
                  Mostrar mais <ArrowRight size={20} />
                </Link>
              </>
            )}
          </div>

          <button
            className={`scroll-button right ${state.right ? 'visible' : ''}`}
            onClick={() => handleScrollAction(scrollRef, 'right', key)}
            aria-label="Rolar para direita"
            disabled={!state.right}
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="home-container">
      {loading ? (
        <div className="hero-skeleton shimmer"></div>
      ) : (
        <Hero backdropPath={randomBackdrop} />
      )}
      <main className="home-main">
        {renderSection("🎬 Em Alta", "Os filmes de maior sucesso no Brasil do momento", trendingMovies, trendingRef, 'trending', '/trending')}
        {renderSection("📅 Lançamentos", "Próximas estreias no Brasil", upcomingMovies, upcomingRef, 'upcoming', '/upcoming')}
        {renderSection("🏆 Melhores da História", "Os filmes mais bem avaliados pelos usuários", topRatedMovies, topRatedRef, 'topRated', '/top-rated')}
      </main>
    </div>
  )
}

export default Home;


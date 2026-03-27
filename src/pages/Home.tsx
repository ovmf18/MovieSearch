import { useEffect, useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  // Refs para controlar o scroll de cada lista
  const trendingRef = useRef<HTMLDivElement>(null)
  const upcomingRef = useRef<HTMLDivElement>(null)
  const topRatedRef = useRef<HTMLDivElement>(null)

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
      } catch (error) {
        console.error("Erro ao buscar filmes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllMovies()
  }, [])

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;

      ref.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  }

  const renderSection = (title: string, subtitle: string, movies: Movie[], scrollRef: React.RefObject<HTMLDivElement>) => (
    <section className="home-section">
      <div className="section-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      <div className="list-wrapper">
        <button
          className="scroll-button left"
          onClick={() => handleScroll(scrollRef, 'left')}
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft size={32} />
        </button>

        <div className="horizontal-list" ref={scrollRef}>
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={`skeleton-${idx}`} />
            ))
          ) : (
            movies.map(movie => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                releaseDate={movie.release_date}
                voteAverage={movie.vote_average}
              />
            ))
          )}
        </div>

        <button
          className="scroll-button right"
          onClick={() => handleScroll(scrollRef, 'right')}
          aria-label="Rolar para direita"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </section>
  )

  return (
    <div className="home-container">
      {loading ? (
        <div className="hero-skeleton shimmer"></div>
      ) : (
        <Hero backdropPath={trendingMovies[0]?.backdrop_path} />
      )}
      <main className="home-main">
        {renderSection("🎬 Em Alta", "Os filmes de maior sucesso no Brasil do momento", trendingMovies, trendingRef as React.RefObject<HTMLDivElement>)}
        {renderSection("📅 Lançamentos", "Próximas estreias no Brasil", upcomingMovies, upcomingRef as React.RefObject<HTMLDivElement>)}
        {renderSection("🏆 Melhores da História", "Os filmes mais bem avaliados pelos usuários", topRatedMovies, topRatedRef as React.RefObject<HTMLDivElement>)}
      </main>
    </div>
  )
}

export default Home;

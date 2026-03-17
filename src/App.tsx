import { useEffect, useState } from 'react'
import { movieService } from './services/api'

interface Movie {
  id: number;
  title: string;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getTrending()
        setMovies(data)
      } catch (error) {
        console.error("Erro ao buscar filmes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>🎬 MovieSearch - Em Alta</h1>
      
      {loading ? (
        <p>Carregando filmes...</p>
      ) : (
        <ul style={{ marginTop: '2rem' }}>
          {movies.map(movie => (
            <li key={movie.id} style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
              • {movie.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { movieService } from '../services/api';
import './MovieCredits.scss';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface MovieDetails {
  id: number | string;
  title: string;
  release_date: string;
  backdrop_path: string;
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

const deptMapping: { [key: string]: string } = {
  'Directing': 'Direção',
  'Writing': 'Roteiro',
  'Production': 'Produção',
  'Visual Effects': 'Efeitos Visuais',
  'Editing': 'Edição',
  'Camera': 'Câmera / Fotografia',
  'Art': 'Arte',
  'Sound': 'Som',
  'Costume & Make-Up': 'Figurino & Maquiagem',
  'Crew': 'Equipe Técnica',
  'Lighting': 'Iluminação'
};

const MovieCredits = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!id) return;
      setLoading(true);
      try {
        console.log("Buscando créditos para o ID:", id);
        const data = await movieService.getMovieDetails(id);
        console.log("Dados recebidos em MovieCredits:", data);
        setMovie(data);
        document.title = `Créditos: ${data.title} | MovieSearch`;
      } catch (error) {
        console.error("Erro ao buscar créditos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="movie-credits-page">
      <div className="loading-screen" style={{ color: '#00DF82', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <h3>Carregando créditos...</h3>
      </div>
    </div>
  );

  if (!movie) return (
    <div className="movie-credits-page">
      <div className="error-screen" style={{ color: '#ff4757', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <h3>Filme não encontrado.</h3>
      </div>
    </div>
  );

  const cast = movie.credits?.cast || [];
  const crew = movie.credits?.crew || [];

  // Group crew by department
  const crewByDept = crew.reduce((acc: { [key: string]: CrewMember[] }, person) => {
    const dept = person.department || 'Outros';
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(person);
    return acc;
  }, {});

  // Sort departments by importance (Directing first)
  const sortedDepts = Object.keys(crewByDept).sort((a, b) => {
    if (a === 'Directing') return -1;
    if (b === 'Directing') return 1;
    if (a === 'Writing') return -1;
    if (b === 'Writing') return 1;
    return a.localeCompare(b);
  });

  const backgroundUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : null;

  return (
    <div className="movie-credits-page">
      <div
        className="backdrop-container"
        style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : { backgroundColor: '#0f1014' }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Voltar para o Filme
      </button>

      <header>
        <h1><span>Elenco e Equipe de </span>{movie.title}</h1>
        <p>Abaixo você encontra todas as pessoas envolvidas na produção deste título.</p>
      </header>

      <div className="credits-grid">
        <section className="cast-column">
          <h2 className="section-title">
            <User size={24} /> Elenco <span>({cast.length})</span>
          </h2>
          <div className="people-list">
            {cast.map((person, idx) => (
              <Link to={`/person/${person.id}`} key={`cast-${person.id}-${idx}`} className="person-entry">
                <div className="person-img-wrapper">
                  {person.profile_path ? (
                    <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} />
                  ) : (
                    <div className="no-img"><User size={24} /></div>
                  )}
                </div>
                <div className="person-info">
                  <span className="name">{person.name}</span>
                  <span className="role">{person.character}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="crew-column">
          <h2 className="section-title">
            Equipe Técnica <span>({crew.length})</span>
          </h2>
          {sortedDepts.map(dept => (
            <div key={dept} className="department-group">
              <h3 className="dept-name">{deptMapping[dept] || dept}</h3>
              <div className="people-list">
                {crewByDept[dept].map((person, idx) => (
                  <Link to={`/person/${person.id}`} key={`crew-${person.id}-${person.job}-${idx}`} className="person-entry">
                    <div className="person-img-wrapper">
                      {person.profile_path ? (
                        <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} />
                      ) : (
                        <div className="no-img"><User size={24} /></div>
                      )}
                    </div>
                    <div className="person-info">
                      <span className="name">{person.name}</span>
                      <span className="role">{person.job}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default MovieCredits;

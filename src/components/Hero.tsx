import { useState } from 'react';
import './Hero.tsx'; // Import order fixed below, this should be Hero.scss but I'll fix in the next chunk
import './Hero.scss';

interface HeroProps {
  backdropPath: string;
}

const Hero = ({ backdropPath }: HeroProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const backgroundUrl = `https://image.tmdb.org/t/p/original${backdropPath}`;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando por:', searchQuery);
  };

  return (
    <section className="hero" style={{ backgroundImage: `url(${backgroundUrl})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h2>Onde o cinema ganha vida.</h2>
          <h3>Sua próxima história favorita está a uma busca de distância. O que vamos assistir hoje?</h3>
          
          <form className="search-box" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Buscar por um Filme, Série ou Pessoa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;

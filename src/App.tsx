import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Search from './pages/Search'
import Upcoming from './pages/Upcoming'
import Trending from './pages/Trending'
import TopRated from './pages/TopRated'
import Watchlist from './pages/Watchlist'
import PersonDetails from './pages/PersonDetails'
import MovieCredits from './pages/MovieCredits'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/top-rated" element={<TopRated />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/person/:id" element={<PersonDetails />} />
          <Route path="/movie/:id/credits" element={<MovieCredits />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App

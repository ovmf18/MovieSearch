import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MovieDetails from './pages/MovieDetails'
import Search from './pages/Search'
import Upcoming from './pages/Upcoming'
import Trending from './pages/Trending'
import TopRated from './pages/TopRated'
import Navbar from './components/Navbar'

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
        </Routes>
      </div>
    </Router>
  )
}

export default App

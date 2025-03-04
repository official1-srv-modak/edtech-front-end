import React from 'react'
import Home from './pages/Home/Home'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import Movie from './pages/Movie/Movie'
import Profiles from './pages/Profiles/Profile'
import Search from './pages/Search/Search'
import NewPage from './pages/NewPage/NewPage'
import EbooksPage from './pages/Ebook/EbooksPage'
import General from './pages/General/General'
import NavyPage from './pages/NavyPage/NavyPage'
import ArmyPage from './pages/ArmyPage/ArmyPage'
import AirForcePage from './pages/AirForcePage/AirForcePage'
import ExamPage from './pages/ExamPage/ExamPage'
import CustomVideoPlayer from './components/CustomVideoPlayer/CustomVideoPlayer'
import Page1 from './pages/TestPages/TestPage1'
import Page2 from './pages/TestPages/TestPage2'
import EndTestPage from './pages/EndTestPage/EndTestPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element ={<Login/>}/>
        <Route path='/player/:id' element={<Player />}/>
        <Route path="/movies" element={<Movie />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/search" element={<Search />} />
        <Route path="/new" element={<NewPage />} />
        <Route path="/ebooks" element={<EbooksPage />} />
        <Route path="/general" element={<General />} />
        <Route path="/navy" element={<NavyPage />} />
        <Route path="/army" element={<ArmyPage />} />
        <Route path="/airforce" element={<AirForcePage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/page1" element={<Page1 />} />
        <Route path="/test/:testTitle" element={<Page2 />} />
        <Route path="/end-test" element={<EndTestPage />} />
      </Routes>
    </div>
  )
}

export default App

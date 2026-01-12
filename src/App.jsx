import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Call from './pages/Call'
import Result from './pages/Result'
import Analysis from './pages/Analysis'
import Practice from './pages/Practice'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/call" element={<Call />} />
        <Route path="/result" element={<Result />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </div>
  )
}

export default App

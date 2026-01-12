import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Settings from './pages/Settings'
import Call from './pages/Call'
import Result from './pages/Result'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/call" element={<Call />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </div>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HelloWorld from '@pages/HelloWorld'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-4xl font-bold">TaskFlow - Coming Soon</h1></div>} />
        <Route path="/hello" element={<HelloWorld />} />
      </Routes>
    </Router>
  )
}

export default App

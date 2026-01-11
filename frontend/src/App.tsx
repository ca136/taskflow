import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { ResponsiveTest } from './pages/ResponsiveTest'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/responsive-test" element={<ResponsiveTest />} />
      </Routes>
    </Router>
  )
}

export default App

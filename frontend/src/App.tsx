import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary, ToastContainer } from './components/common'
import { Dashboard } from './pages/Dashboard'
import { ResponsiveTest } from './pages/ResponsiveTest'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/responsive-test" element={<ResponsiveTest />} />
        </Routes>
        <ToastContainer />
      </Router>
    </ErrorBoundary>
  )
}

export default App

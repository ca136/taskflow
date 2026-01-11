import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastProvider, ToastContainer } from './components/Toast'
import { useToast } from './hooks/useToast'
import ErrorBoundary from './components/ErrorBoundary'

function AppContent() {
  const { toasts, removeToast } = useToast()

  return (
    <>
      <Routes>
        <Route path="/" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-4xl font-bold">TaskFlow - Coming Soon</h1></div>} />
      </Routes>
      <ToastContainer toasts={toasts} onClose={removeToast} position="top-right" />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from '@components/common/Header'

function App() {
  const handleAddTask = () => {
    console.log('Add task button clicked')
    // TODO: Open modal or navigate to add task page
  }

  return (
    <Router>
      <Header onAddTask={handleAddTask} />
      <Routes>
        <Route path="/" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-4xl font-bold">TaskFlow - Coming Soon</h1></div>} />
      </Routes>
    </Router>
  )
}

export default App

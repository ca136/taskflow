import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import KanbanBoard from './components/board/KanbanBoard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KanbanBoard boardId="default-board" />} />
      </Routes>
    </Router>
  )
}

export default App
